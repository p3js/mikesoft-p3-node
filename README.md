# MikesoftP3
This simple, easy-to-use library allows you to connect to the Mikesoft P3 network included in [Windows 96](https://windows96.net/).


### To install

To install, run `npm install mikesoftp3`.

### To use

The export is actually a constructor, which you can use to create P3 instances, like this:
```js
const P3=require("mikesoftp3")
const p3=new P3()
```

You can also use an existing P3 address if you have it's key, by doing this:
```js
const P3=require("mikesoftp3")
const p3=new P3("myp3secret444=")
```

You can also specify configuration options, like this:
```js
const P3=require("mikesoftp3")
const p3=new P3({
    autoinit: true,
    secret:'myp3secret444=',
    url:'wss://my-p3-relay.example.com/'
})
```

To start listening on a port, use `P3.listen`.
```js
const P3=require('mikesoftp3')
const p3=new P3({
    autoinit:true,
    secret:'examplefB3='
})
p3.listen(121, (client)=>{
    client.emit(["TEXT",'if you are on superterm you will see this'])
})
```

To listen to input from the client, use `client.on`.

```js
const P3=require('mikesoftp3')
const p3=new P3({
    autoinit:true,
    secret:'examplefB3='
})
p3.listen(121, (client)=>{
    client.emit(["TEXT",'What is your name?'])
    client.on('message',(data)=>{
        if(data[0]=="INPUT") {
            client.emit(['TEXT', `Hello, ${data[1]}`])
        }
    })
})
```

Besides hosting a P3 server, you can also connect to a P3 server.
This example replies to the example above:
```js
const P3=require('mikesoftp3')
const p3=new P3({
    autoinit:true,
    secret:'examplefB3='
})
p3.on('connect',()=>{
    var client=p3.createClient('gXbeUepTwY.ppp',121)
    client.on('message',(data)=>{
        if(data[1]=="What is your name?") {
            client.emit(['INPUT','Barbra'])
        }
    })
})
```

### Why the constructor?
Originally, before the initial release, it didn't come with a constructor. However, you had to instantly set the key after the package was required. It also made it not able to have more than one P3 connection without requiring the package multiple times.

Because of the constructor, you can now set the key, and even the URL of the server. It also makes it easier to manage multiple P3 clients/servers with different addresses.

### How well does this work?
It works pretty well. Data should usually transmit fast, but that also depends on your internet speed. This P3 library should usually be as fast as P3 in [Windows 96](https://windows96.net/).

### Can I host a P3FS from here?
Yes, you can host a P3FS using this API, but there currently is not a P3FS library.
