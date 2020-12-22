const assert = require('assert');
const dns = require('dns');
const net = require('net');

const icmp = require('./index');

const check = new Promise(resolve => {
    dns.lookup('google.com', (err) => {
        if (err && err.code == "ENOTFOUND") {
            fail();
        } else {
            assert.ok(true);

            resolve(true);
        }
    });
});

// describe('Offline ICMP', () => {
//     describe('ping 127.0.0.1', () => {
//         const ping = icmp.ping('127.0.0.1');

//         try {
//             it('ip property is 127.0.0.1', async () => {
//                 const { ip } = await ping;
//                 console.log(ip)

//                 assert.strictEqual(ip, '127.0.0.1');
//             });

//             it('open property is true', async () => {
//                 const { open } = await ping;

//                 assert.strictEqual(open, true);
//             });
//         } catch (e) { fail(e) }
//     });
// });

describe('Online ICMP', () => {
    it('internet connection', () => {
        check.then(res => res ? assert.ok(true) : fail());
    });

    check.then(res => {
        if (!res) return;

        describe('ping www.google.com', () => {
            const ping = icmp.ping('www.google.com');

            try {
                it('ip property is an IP', async () => {
                    const { ip } = await ping;

                    assert.notStrictEqual(net.isIP(ip), 0);
                });

                it('open property is true', async () => {
                    const { open } = await ping;

                    assert(open);
                });
            } catch (e) { fail(e) }
        });

        describe('ping a non-existing domain', async () => {
            try {
                await icmp.ping('this-domain-does.not.exist');
            } catch (error) {
                try {
                    it('rejects with the error object', (done) => {
                        ping.catch(error => {
                            assert(error.message.indexOf('ENOTFOUND this-dns-does.not.exist'));
                            assert(error.code === 'ENOTFOUND');
                            assert(error.hostname === 'this-dns-does.not.exist');
                            done();
                        })
                    });
                } catch (e) { fail(e) }
            }
        });
    });
});
