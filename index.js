const raw = require('raw-socket');
const net = require('net');
const dns = require('dns');

class ICMP {
    constructor(host) {
        this.host = host;

        this.ip = '';

        this.socket = raw.createSocket({
            protocol: raw.Protocol.ICMP
        });

        this.open = false;
        this.type = '';
        this.code = '';
    }

    close() {
        this.socket.close();

        if (this._timeout) {
            clearTimeout(this._timeout);
        }
    }

    _resolveIP() {
        return new Promise(resolve => {
            if (!this.ip) {
                if (net.isIPv4(this.host)) {
                    this.ip = this.host;
                    return resolve();
                }

                dns.resolve4(this.host, (err, [ip]) => {
                    if (err) return reject(err);

                    this.ip = ip;

                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    _queue(header, timeout = 5000) {
        return new Promise(async (resolve, reject) => {
            try {
                await this._resolveIP();
            } catch (e) {
                return reject(e);
            }

            this.socket.send(header, 0, header.length, this.ip, (err, source) => {
                if (err) {
                    return reject(err);
                }

                this._timeout = setTimeout(() => {
                    resolve();
                    this.close();
                }, timeout);

                this.start = process.hrtime();
            });

            this.socket.on('message', (buffer, source) => {
                const NS_PER_SEC = 1e9;

                this.diff = process.hrtime(this.start);
                this.elapsed = (this.diff[0] + this.diff[1] / NS_PER_SEC) * 1000;

                const offset = 20;
                const type = buffer.readUInt8(offset);
                const code = buffer.readUInt8(offset + 1);

                this.parse(type, code);

                this.close();

                resolve();
            });

            this.socket.on('error', err => {
                reject(err);
            });
        });
    }

    createHeader(data) {
        const datastr = String(data);

        /**
         * We need 8 bytes (4 octets) for ICMP headers and 1 byte more per data's char
         */
        const header = Buffer.alloc(8 + datastr.length);

        /**
         * Fill data part to prevent network leaking
         */
        header.fill(0, 8);

        /**
         * Type
         */
        header.writeUInt8(8, 0);

        header.writeUInt8(0, 1);
        header.writeUInt16BE(0, 2);

        header.writeUInt16LE(process.pid % 65535, 4);
        header.write(datastr, 8);
        return raw.writeChecksum(header, 2, raw.createChecksum(header));
    }

    send(data = "", timeout = 5000) {
        return new Promise((resolve, reject) => {
            const header = this.createHeader(data);

            this._queue(header, timeout).then(resolve, reject);
        });
    }

    static send(host, data = "", timeout = 5000) {
        const obj = new this(host);

        return new Promise((resolve, reject) => obj.send(data, timeout)
            .then(() => resolve(obj))
            .catch(err => reject(err))
        );
    }

    ping(timeout = 5000) {
        return this.send('', timeout);
    }

    static ping(host, timeout = 5000) {
        return this.send(host, '', timeout);
    }

    listen(cb = (buffer, source) => {}) {
        return this.socket.on('message', cb);
    }

    static listen(cb = (buffer, source) => {}) {
        const obj = new this(null);
        return obj.listen(cb);
    }

    parse(type, code) {
        const ECHOMessageType = ['REPLY', 'NA', 'NA', 'DESTINATION_UNREACHABLE', 'SOURCE_QUENCH', 'REDIRECT'];
        const DestinationUnreachableCode = ['NET', 'HOST', 'PROTOCOL', 'PORT', 'FRAGMENTATION', 'ROUTE_FAILED', 'NET_UNKNOWN', 'HOST_UNKNOWN', 'HOST_ISOLATED', 'NET_PROHIBITED', 'HOST_PROHIBITED', 'NET_UNREACHABLE', 'HOST_UNREACHABLE', 'COMM_PROHIBITED', 'HOST_PRECEDENCE', 'PRECEDENCE_CUTOFF'];
        const RedirectCode = ['NETWORK', 'HOST', 'SERVICE_NETWORK', 'HOST_NETWORK'];

        this.type = 'OTHER';
        this.code = 'NO_CODE';

        this.open = (type === 0);

        if (type < ECHOMessageType.length) {
            this.type = ECHOMessageType[type];
        }

        switch (type) {
            case 3: this.code = DestinationUnreachableCode[code]; break;
            case 5: this.code = RedirectCode[code]; break;
        }
    }
}

module.exports = ICMP;
