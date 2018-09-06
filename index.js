const raw = require('raw-socket');
const net = require('net');

class ICMP {
    constructor(ipv4, host) {
        this.host = host || ipv4;
        this.ip = ipv4;

        this.socket = raw.createSocket({
            protocol: raw.Protocol.ICMP
        });

        this.open = false;
        this.type = '';
        this.code = ''
    }
    
    send(data = "") {
        return new Promise((resolve, reject) => {
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
             * Type must defer to specify the IP family
             */
            const type = net.isIPv6(this.ip) ? 128 : 8;
            header.writeUInt8(type, 0);

            header.writeUInt8(0, 1);
            header.writeUInt16BE(0, 2);
            header.writeUInt16LE(process.pid, 4);
            header.write(datastr, 8);
            raw.writeChecksum(header, 2, raw.createChecksum(header));

            this.socket.send(header, 0, header.length, this.host, (err, bytes) => {
                if (err) {
                    return reject(err);
                }

                this.start = process.hrtime()[1];
            });

            this.socket.on('message', (buffer, source) => {
                this.end = process.hrtime()[1];
                this.elapsed = (this.end - this.start) / 1000000;

                const offset = 20;
                const type = buffer.readUInt8(offset);
                const code = buffer.readUInt8(offset + 1);

                this.socket.close();

                this.parse(type, code);

                resolve();
            });

            this.socket.on('error', err => {
                reject(err);
            });
        });
    }

    static send(host, data) {
        const obj = new this(host);

        return new Promise((resolve, reject) => obj.send(data)
            .then(() => resolve(obj))
            .catch(err => reject(err))
        );
    }

    ping() {
        return this.send();
    }

    static ping(host) {
        const obj = new this(host);

        return new Promise((resolve, reject) => obj.ping()
            .then(() => resolve(obj))
            .catch(err => reject(err))
        );
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
