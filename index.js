const raw = require('raw-socket');

class ICMP {
    constructor(ipv4, host) {
        this.host = host || ipv4;
        this.ip = ipv4;

        this.header = Buffer.alloc(14);
        this.header.writeUInt8(0x8, 0);
        this.header.writeUInt16LE(process.pid, 4);
        this.header.writeUInt16LE(this.checksum(), 2);

        this.open = false;
        this.type = '';
        this.code = ''
    }

    checksum() {
        const buffer = Buffer.from(this.header);
        let sum = 0;

        for (let i = 0; i < buffer.length; i = i + 2) {
            sum += buffer.readUIntLE(i, 2);
        }

        sum = (sum >> 16) + (sum & 0xFFFF);
        sum += (sum >> 16);
        sum = ~sum;

        return (new Uint16Array([sum]))[0];
    }

    ping() {
        return new Promise((resolve, reject) => {
            const socket = raw.createSocket({
                protocol: raw.Protocol.ICMP
            });

            socket.send(this.header, 0, 12, this.host, (err, bytes) => {
                if (err) {
                    return reject(err);
                }

                this.start = process.hrtime()[1];
            });

            socket.on('message', (buffer, source) => {
                this.end = process.hrtime()[1];
                this.elapsed = (this.end - this.start) / 1000000;

                const offset = 20;
                const type = buffer.readUInt8(offset);
                const code = buffer.readUInt8(offset + 1);

                socket.close();

                this.parse(type, code);

                resolve();
            });

            socket.on('error', err => {
                reject(err);
            });
        });
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
