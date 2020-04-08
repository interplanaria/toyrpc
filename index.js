const jayson = require('jayson')
const Toychain = require('toychain')
/***********************************************************

##### SERVER

const Toychain = require('toychain')
const Toyrpc = require('toyrpc')
const toychain = new Toychain({ xpriv: <xpriv> })
const rpc = Toyrpc.init({
  chain: toychain,
  readonly: true,
  port: 3000,
  protocol: "http"
})

##### CLIENT

Make a JSON-RPC 2.0 compliant HTTP request (or TCP request)

POST <endpoint>

{
  "jsonrpc": "2.0",
  "method": "add",
  "params": [{
    "v": 1,
    "out": [{
      "o0": "OP_0", "o1": "OP_RETURN", "s2": "hello toy"
    }],
    "edge": { "in": 1, "out": 2 }
  }],
  "id": 0
}

See JSON-RPC 2.0 Spec for more details:
https://www.jsonrpc.org/specification

************************************************************/
const init = (o) => {
  let config = {
    port: o.port ? o.port : 3012,
    protocol: o.protocol ? o.protocol : "http"
  }
  let server = jayson.server({
    clone: (params, callback) => {
      if (o.readonly) {
        callback({ code: 403, message: "readonly mode" })
      } else {
        let result = o.chain.clone({ tx: params.tx })      
        if (result.error) {
          callback({ code: 400, message: result.error })
        } else {
          callback(null, result)
        }
      }
    },
    add: (params, callback) => {
      if (o.readonly) {
        callback({ code: 403, message: "readonly mode" })
      } else {
        let result = o.chain.add(params)
        if (result.error) {
          callback({ code: 400, message: result.error })
        } else {
          callback(null, result)
        }
      }
    },
    push: (params, callback) => {
      if (o.readonly) {
        callback({ code: 403, message: "readonly mode" })
      } else {
        o.chain.push(params.id)
        callback(null, params.id)
      }
    },
    count: (params, callback) => {
      if (params.length === 1) {
        let count = o.chain.count(params[0])
        callback(null, count)
      } else {
        callback("count method requires a single parameter")
      }
    },
    reset: (params, callback) => {
      if (o.readonly) {
        callback({ code: 403, message: "readonly mode" })
      } else {
        o.chain.reset();
        callback(null, "success")
      }
    },
    get: (params, callback) => {
      let result = o.chain.get(params)
      result.forEach((r) => {
        r.edge = JSON.parse(r.edge)
      })
      callback(null, result)
    }
  });
  server[config.protocol]().listen(config.port);
  return server;
}

module.exports = {
  init: init
}
