const icmp = require('icmp');

icmp.listen((buffer, source) => {
    console.log(`Received ${buffer.length} bytes buffer from ${source}`);
});
