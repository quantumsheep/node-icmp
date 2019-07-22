<h1 align="center">Internet Control Message Protocol in Node</h1>
<p>
  <img alt="Version" src="https://img.shields.io/npm/v/icmp.svg">
  <a href="https://twitter.com/qtmsheep">
    <img alt="Twitter: qtmsheep" src="https://img.shields.io/twitter/follow/qtmsheep.svg?style=social" target="_blank" />
  </a>
</p>

> Internet Control Message Protocol in Node

# Install

```sh
npm install icmp
```

On Windows, the Windows Build Tools are required: `npm install -g windows-build-tools`

# Usage
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

### (static) ICMP.listen(cb: (buffer, source) => void)
Listen to incomming ICMP requests.

### ICMP.listen(cb: (buffer, source) => void)
Listen to incomming ICMP requests.

### ICMP.close()
Close the raw socket stream. Can be used to stop a request.

# Author

👤 **Nathanael Demacon**

* Twitter: [@qtmsheep](https://twitter.com/qtmsheep)
* Github: [@quantumsheep](https://github.com/quantumsheep)

# Show your support

Give a ⭐️ if this project helped you!
