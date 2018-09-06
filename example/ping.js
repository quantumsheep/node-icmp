const icmp = require('icmp');
const readline = require('readline');

const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
});

rl.question('IP (v4 or v6): ', ip => {
    if (!net.isIP(ip)) {
        return console.log('Invalid IP.');
    }

    const rrtype = net.isIPv4(ip) ? 'A' : 'AAAA';

    dns.resolve(ip, rrtype, (err, [ipv4]) => {
        if (err || !ipv4) return console.log(err);

        setInterval(() => {
            icmp.ping(ipv4)
                .then(obj => {
                    console.log(obj.open, obj.elapsed);
                })
                .catch(err => { });
        }, 1000);
    });
});