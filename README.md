# Internet Control Message Protocol in Node
Internet Control Message Protocol implementation in Node (it has Promises).

# How to install
Install with npm: `npm install --save icmp`

# How to use
You can view examples in `example` directory.

### Little example for lazy peoples who don't want to open `exemple` directory
Here's how to find if a network card is receiving or not (basic ping) -->
```js
const icmp = require('icmp');

icmp.ping(ipv4)
    .then(obj => console.log(obj.open))
    .catch(err => { });
```

# Usage:
## Properties
### ICMP.host: string
The requested HOST (can be an IP)

### ICMP.ip: string
The requested IP, when host parameter is given to the constructor, the DNS will be resolved to get this IP adress

### ICMP.open: boolean
This property will be `true` or `false`, depending on the ping response

### ICMP.type: string
ICMP response type, will be one from this array:
```js
['REPLY', 'NA', 'NA', 'DESTINATION_UNREACHABLE', 'SOURCE_QUENCH', 'REDIRECT']
```
### ICMP.code: string
ICMP response code, will be one from this array:
```js
['NET', 'HOST', 'PROTOCOL', 'PORT', 'FRAGMENTATION', 'ROUTE_FAILED', 'NET_UNKNOWN', 'HOST_UNKNOWN', 'HOST_ISOLATED', 'NET_PROHIBITED', 'HOST_PROHIBITED', 'NET_UNREACHABLE', 'HOST_UNREACHABLE', 'COMM_PROHIBITED', 'HOST_PRECEDENCE', 'PRECEDENCE_CUTOFF', 'NETWORK', 'HOST', 'SERVICE_NETWORK', 'HOST_NETWORK']
```


## Methods
Note: default `timeout` of each methods is `5000ms`.

### (static) ICMP.ping(host: string, timeout?: number): Promise<ICMP>
Send a ping to a specific host. Returns a Promise resolving an ICMP instance and rejecting an Error.

### ICMP.ping(timeout?: number): Promise<ICMP>
Send a ping to the defined ICMP instance's host. Returns a Promise, resolving nothing and rejecting an Error.

### (static) ICMP.send(host: string, data?: string)
Send data to a specific host through ICMP. Returns a Promise resolving an ICMP instance and rejecting an Error.

```js
icmp.send('10.43.65.9', "Hey, I'm sending a message!")
    .then(obj => {
        console.log(obj.open ? 'Done' : 'Failed')
    })
    .catch(err => console.log(err));
```

### ICMP.send(data?: string, timeout?: number)
Send data to the defined ICMP instance's host. Returns a Promise resolving nothing and rejecting an Error.

### ICMP.close()
Close the raw socket stream. Can be used to stop a request.

## License
MIT