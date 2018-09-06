const icmp = require('icmp');

const readline = require('readline');
const net = require('net');
const dns = require('dns');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('IP (v4 or v6): ', ip => {
    if (!net.isIP(ip)) {
        return console.log('Invalid IP.');
    }

    const rrtype = net.isIPv4(ip) ? 'A' : 'AAAA';

    dns.resolve(ip, rrtype, (err, [ipv4]) => {
        if (err || !ipv4) return console.log(err);

        const ping = ip => {
            icmp.ping(ip)
                .then(obj => {
                    process.stdout.write(`${obj.host}   ${obj.open}\r${obj.open ? '\n' : ''}`);
                })
                .catch(err => { });
        }

        const [first, second, third] = ipv4.split('.');

        let i = 0;
        let j = 0;
        let k = 0;

        const pinger = setInterval(() => {
            if (first < 128) {
                if (k > 255) {
                    k = 0;
                    j++;
                }

                if (j >= 255) {
                    j = 0;
                    i++;
                }

                if (i > 255 && j >= 255 && k >= 255) {
                    return clearInterval(pinger);
                }

                ping([first, i, j, k++].join('.'));
            } else if (first < 192) {
                if (j > 255) {
                    j = 0;
                    i++;
                }

                if (i > 255 && j >= 255) {
                    return clearInterval(pinger);
                }

                ping([first, second, i, j++].join('.'));
            } else {
                if (i >= 255) {
                    return clearInterval(pinger);
                }

                ping([first, second, third, i++].join('.'));
            }
        }, 0);
    });
});