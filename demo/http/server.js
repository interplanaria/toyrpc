const Toychain = require('toychain')
const Toyrpc = require('../../index')
const toychain = new Toychain({
  xpriv: "xprv9s21ZrQH143K4WqdoZtETcEoUnSCmaMQdDpCjoRHC4AX5eRg4BcQuxzQMeAWk9N2VRPDJVeSdtNpPdJnkwEfrYVAjNnmN9aW6ZbERL8JAKU"
})
const rpc = new Toyrpc({
  chain: toychain,
  port: 3012,
  protocol: "http"
})
rpc.listen()
