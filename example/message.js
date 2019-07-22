const icmp = require('icmp');

icmp.send('10.43.65.9', "Hey, I'm sending a message!")
    .then(obj => console.log(obj.open ? 'Done' : 'Failed'))
    .catch(err => console.log(err));
