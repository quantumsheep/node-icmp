# Internet Control Message Protocol in Node
Internet Control Message Protocol implementation in Node (it has Promises).

## How to install
Install with npm: 
> `npm install --save icmp`

## How to use
You can view examples in `example` directory.

### Little example for lazy peoples
Here's how to find if a network card is receiving or not (basic ping) -->
```js
const icmp = require('icmp');

icmp.ping(ipv4)
    .then(obj => console.log(obj.open))
    .catch(err => { });
```

## ICMP class:
### Properties
> ## ICMP.host: string
> The requested HOST (can be an IP)
> ## ICMP.ip: string
> The requested IP
> ## ICMP.open: boolean
> The ICMP response
> ## ICMP.type: string
> The response message type, can be:
> ```js
> ['REPLY', 'NA', 'NA', 'DESTINATION_UNREACHABLE', 'SOURCE_QUENCH', 'REDIRECT']
> ```
> ## ICMP.code: string
> The response code, can be:
> ```js
> ['NET', 'HOST', 'PROTOCOL', 'PORT', 'FRAGMENTATION', 'ROUTE_FAILED', 'NET_UNKNOWN', 'HOST_UNKNOWN', 'HOST_ISOLATED', 'NET_PROHIBITED', 'HOST_PROHIBITED', 'NET_UNREACHABLE', 'HOST_UNREACHABLE', 'COMM_PROHIBITED', 'HOST_PRECEDENCE', 'PRECEDENCE_CUTOFF', 'NETWORK', 'HOST', 'SERVICE_NETWORK', 'HOST_NETWORK']
> ```

### Methods
> ## ICMP.ping(host: string): Promise<ICMP>
> Send a ping to an host and get a Promise resolving an ICMP instance

## License
MIT