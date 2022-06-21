const { io } = require("socket.io-client");




class P3 {
    /**
     * Your P3 secret set when creating the interface.
     * @type {string}
     * 
     *
     */
    key
    /**
     * Your P3 address, provided by the network.
     * @type string
     */
     adr
     /**
      * Wether the interface is connected to the P3 network.
      * @type boolean
      */
     active
  /**
   * Constructs a P3 interface object.
   * @param options{{autoinit:boolean,secret:string,url:string}|string} - The P3 config options. Strings will be treated as your secret.
   */
  constructor(options) {
    options=options||""
      if(typeof options=='string'||options instanceof String) {
          var url=""
          var secret=options
      } else {
          var {secret,url}=options
          if(options.autoinit) {
              setTimeout(()=>this.start(),3)
          }
      }
    url=String(url||"wss://p3.windows96.net/")||"wss://p3.windows96.net/"

var $CONNECTED=false;

var $totalMsg=0;
var letters = "abcdefghijklmnopqrstuvwxyz+1234567890/ABCDEFGH,:#\\?@-_]{}~";


function waitUntil(bool) {
  return new Promise(function (g) {
    var X$=setInterval(function () {
      if(bool()){
        clearInterval(X$);
        g();
      }
    })
  })
}



var key=secret||generateSecretKey()

var usedPorts = [];


function $ResponsePort() {
  var p$=[];
  for(var i = 0; i < 70001;i++) {
    if(!usedPorts.includes(i)) {
      p$.push(i)
    }
  }
  return p$[
    Math.floor(
      Math.random()*p$.length
    )
  ]
};








function generatePeerID() {
  var $r='';
  for(var i = 0; i < 40;i++) {
    $r+=letters[Math.floor(
      Math.random()*letters.length
    )]
  }
  return btoa($r)
}

function generateSecretKey() {
  var $r='';
  for(var i = 0; i < 10;i++) {
    $r+=letters[Math.floor(
      Math.random()*letters.length
    )]
  }
  return btoa($r)
}

var skt=io(url,{
  autoConnect: false
});
skt.on("connect", function (E) {
  setTimeout(function () {
  skt.emit("hello", key)
  }, 100)
});




function setskey(sky){
  key=sky;
}
/**
 * Constructs client to connect to a P3 Server.
 * @param {string} adr - The P3 address to connect to.
 * @param {string|number} prt - The port to connect to.
 */
function P3Client(adr,prt) {
    /**@private*/
  var $NONCE = this.$NONCE = {
    count: 0
  };
  /**@private*/
  var $E=this.$EVT={
    "connect":[],
    "message":[],
    'disconnect':[]
  };
  /**@private*/
  var $H=this.$HBData={
    intervalId:0,
    beat:15000
  }
  var that=this
  /**
   * Information about the server you are connecting to.
   */
  var $S=this.server = {
      /**
       * The address of the server you are connecting to.
       */
    address:adr,
    /**
     * The port of the server you are connecting to.
     */
    port:prt,
    /**
     * The address and port of the server, combined by a colon.
     */
    destination:adr+":"+prt,
    /**
     * The internal peer ID of your client.
     * @type {string|null}
     */
    id: null,
  };
  var rpt=$ResponsePort();
  /**@private*/
  this.$CLIENT = {
    responsePort:rpt
  }
  skt.on('packet', function (a$) {
     if(a$.source==$S.address&&a$.port==rpt&&a$.data.type=='message') {
      for(var i = 0; i < $E.message.length;i++) {
        try {
          $E.message[i](a$.data.data)
        } catch (E){
          null
        }
      }
    } else if(a$.source==$S.address&&a$.port==rpt&&a$.data.type=='disconnect') {
      for(var i = 0; i < $E.message.length;i++) {
        try {
          $E.disconnect[i]()
        } catch (E){
          null
        }
      }
       $CONNECTED=false
       that.ended=true
    }
  });
  var $$ACK=false
  var hb$ = function (a$) {
    if($$ACK){return}
    $$ACK=true
    for(var i = 0; i < $E.connect.length;i++) {
      try {
        $E.connect[i]()
      } catch (E) {
        null
      }
    }
    $S.id=a$.data.peerID;
    $H.beat=a$.data.heartbeat;
    $H.intervalId=setInterval(function () {
      skt.emit('packet', {
        dest: adr+":"+prt,
        data: {
          type: 'heartbeat',
          peerID: $S.id
        },
        nonce:0
      });
    }, a$.data.heartbeat)
  }
  var $$WAITFORACCEPT = function (a$) {
    if(a$.data.type==='ack'&&a$.port==rpt) {
      hb$(a$)
    }
  }
  this.ended=false;
  setTimeout(async function () {
    await waitUntil(function(){return $CONNECTED})
    skt.emit('packet', {
      data: {
        type: 'connect',
        peerID: null,
        responsePort: rpt,
        nonce: 0
      },
      nonce:0,
      dest: adr+":"+prt,
    });
    $NONCE.count=$NONCE.count+1;
  },500)
  skt.on("packet", $$WAITFORACCEPT)
}
/**
 * Listens for events.
 * @param {string} event The name of the event.
 * @param {(...args:any[])=>any} handler The function to call when the event is triggered.
 */
P3Client.prototype.on = function(event,handler) {
  if(!handler instanceof Function) {
    throw new TypeError("listener must be a function")
  }
  if(!this.$EVT[event]){return}
  this.$EVT[event].push(handler)
}

/**
 * Ends the connection with the server.
 */
P3Client.prototype.end = function () {
  clearInterval(this.$HBData.intervalId);
  skt.emit("packet", {
    dest:this.server.destination,
    data:{
      type:'disconnect',
      peerID:this.server.id
    },
    nonce:0,
  });
  /**
   * Wether the server has killed the connection with the client.
   */
  this.ended=true;
}

/**
 * Sends data to the server.
 * @param {*} data The data to send to the server.
 */
P3Client.prototype.emit = function (data) {
  if(this.ended) {
    throw new ReferenceError(
      "cannot emit on closed connection"
    )
  }
  skt.emit('packet', {
    dest:this.server.destination,
    data: {
      type:'message',
      peerID:this.server.id,
      data:data,
      nonce:this.$NONCE.count
    },
    nonce:0
  });
  this.$NONCE.count=this.$NONCE.count+1;
}







skt.on("packet", function(args) {
  if(args.data.type=="connect") {
    if(ports[args.port]) {
      var peerid=generatePeerID();
      skt.emit('packet', {
        data:{
          type:'ack',
        message: "Connection accepted",
          peerID:peerid,
        success:true,
        heartbeat:15000,
          code:100,
          nonce:0
        },
        dest:args.source+":"+args.data.responsePort,
        nonce:0
      });
      var t$EVT = {
        message:[]
      }
      var $NONCE={count:1}
      ports[args.port].evt({
        toString:function(){return "[object P3Event]"},
        peerId:peerid,
        peer: {
          adr: args.source,
          port: args.data.responsePort,
          emit: function (data) {
          skt.emit('packet', {
        data:{
          type:'message',
          data:data,
          peerID:null,
        success:true,
          nonce:0
        },
        dest:args.source+":"+args.data.responsePort,
        nonce:$NONCE.count
      });
          $NONCE.count = $NONCE.count+1;
        }
        },
        nonceCount: {n$:$NONCE},
        on: CreateMessageListener(
          $NONCE,
          peerid,
          args.source,
          args.data.responsePort,
          args.port,
          t$EVT
        ),
        emit: function (data) {
          skt.emit('packet', {
        data:{
          type:'message',
          data:data,
          peerID:null,
        success:true,
          nonce:0
        },
        dest:args.source+":"+args.data.responsePort,
        nonce:$NONCE.count
      });
          $NONCE.count = $NONCE.count+1;
        }
      })
    }
  }
})


function CreateMessageListener(n$,i$,a$,p$,h$) {
  return function (e$,f$) {
    if(e$==='message') {
    skt.on('packet', function(evt){
      if(evt.port===h$&&evt.source===a$&&evt.data.type==='message'&&evt.data.peerID==i$) {
        f$(evt.data.data)
      }
    })
    } else if(e$==="disconnect") {
      skt.on('packet', function(evt){
      if(evt.port===h$&&evt.source===a$&&evt.data.type==='disconnect'&&evt.data.peerID==i$) {
        f$()
      }
    })
    }
  }
}


var L$ = {
  'fail':[],
  'connect':[]
};






var ports = {};

function addPort(portNumber,listenerFunction) {
  if(!listenerFunction instanceof Function) {
    throw new TypeError("listener must be a function");
  }
  if(usedPorts.includes(portNumber)) {
    throw new ReferenceError("port is already being used")
  }
  if(isNaN(portNumber)) {
    throw new TypeError("port must be an event name or number");
  }
  ports[portNumber]={
    evt:listenerFunction
  }
}

/**
 * Listens for instance-wide P3 events.
 * @param {string} event The name of the event.
 * @param {(...args:any[])=>any} handler The function to call when the event is triggered.
 */

this.on=function(event,handler) {
    if(!handler instanceof Function) {
        throw new TypeError("listener must be a function");
      }
      if(L$[event]) {
        L$[event].push(handler);
        return;
      }
}

    function removePort(portNumber) {
      ports[portNumber]=undefined
      delete ports[portNumber]
    }

var $EVT = {
  dispatch: function (name,evt) {
    if(!L$[name]) {
      return;
    }
    var gL=L$[name]
    for(var i=0;i<gL.length;i++){
      gL[i](evt)
    }
  }
}
    this.endPort=removePort


var $ADR="";

skt.on("hello", function(e){
    console.log(e)
    if(!e.success && e.message==="PPP Server Error: Address already in use") {
      $EVT.dispatch(
        'fail',
        {
          reason: "Address is in use",
          code: "ADDRESS_IN_USE"
        }
      )
    } else if(!e.success) {return } else {
      $CONNECTED=true
      $ADR=e.address
      $EVT.dispatch(
        'connect',
        {
          address:$ADR
        }
      )
    }
})
    /**
     * Listens for a connection on a specific port.
     * @param {string|mumber} port - The port to listen on
     * @param {(client:P3Event)=>any} listener - The callback when the port is connected to
     */
    this.listen=function(port,listener){return addPort(port,listener)}
    Object.defineProperty(this,'adr',{
      get:function() {
        return $ADR
      }
    })
    Object.defineProperty(this,'active',{
      get:function() {
        return skt.connected
      }
    })
    Object.defineProperty(this,'key',{
      get:function() {
        return key
      },
      set:function(secret) {
        key=secret
      }
    })
    /**
     * Creates a client to connect to a P3 server.
     * @param {string} address 
     * @param {string|number} port 
     */
    this.createClient=function(address,port) {
      return new P3Client(address,port)
    }

    class P3Event {
        /**
         * The internal peer ID.
         * @type {string}
         */
        peerID
        /**
         * Represents the connected client.
         * @type {P3ClientPeer}
         */
        peer
        /**
         * Sends data to the connected peer.
         * @param {any} data The data to send.
         */
        emit(data) {}
        /**
         * Listens for events.
         * @param {string} event The name of the event to listen for.
         * @param {(...args:any[])=>any} handler The function to call when the event is triggered.
         */
        on(event,handler)
    }

    class P3ClientPeer {
        /**
         * The peer's P3 address.
         * @type {string}
         */
        adr
        /**
         * The response port of the peer.
         * @type {string}
         */
        port
        /**
         * Sends data to the connected peer.
         * @param {any} data The data to send.
         * @deprecated Use P3Event.emit instead of P3Event.peer.emit.
         */
        emit(data){}
    }


    /**
     * Force exits the network and terminates all active P3 connections.
     */
    this.kill=function(){
      skt.close()
    }
    /**
     * Starts the P3 session if it has been killed.
     */
    this.start=function(){
      skt.open()
    }
  }
  
}

module.exports = P3
