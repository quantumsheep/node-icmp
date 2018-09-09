const assert = require('assert');
const dns = require('dns');
const net = require('net');

const icmp = require('./index');

describe('Offline ICMP', () => {
    describe('ping localhost', () => {
        const ping = icmp.ping('localhost', 1900);

        try {
            it('ip property is 127.0.0.1', async () => {
                const { ip } = await ping;

                assert(ip, '127.0.0.1');
            });

            it('open property is true', async () => {
                const { open } = await ping;

                assert(open, true);
            });
        } catch (e) { assert.fail(e) }
    });
});
const check = new Promise(resolve => {
    dns.lookup('google.com', (err) => {
        if (err && err.code == "ENOTFOUND") {
            assert.fail();

            resolve(false);
        } else {
            assert.ok(true);

            resolve(true);
        }
    });
});

describe('Online ICMP', () => {
    it('internet connection', () => {
        check.then(res => res ? assert.ok(true) : assert.fail());
    });

    check.then(res => {
        if(!res) return;

        describe('ping www.google.com', () => {
            const ping = icmp.ping('www.google.com');

            try {
                it('ip property is an IP', async (done) => {
                    const { ip } = await ping;

                    assert(net.isIP(ip) >= 0, true);
                });

                it('open property is true', async () => {
                    const { open } = await ping;

                    assert(open, true);
                });
            } catch (e) { assert.fail(e) }
        });
    });
});
