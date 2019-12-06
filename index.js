
// start the server
const WebServer = require('actions-http')
const Tables = require('./models')
const API = require('./libs/api')

// initialize local state
const tables = Tables()
const cryptapi = API({
  baseURL: 'https://cryptapi.io/api/'
})

// start app and expose api
WebServer({
  port: 3000
}, {
  async ping(params) {
    return 'pong'
  },
  async echo(params) {
    console.log('echo', params)
    return params
  },
  handleCallback() {
    //TODO: handle api callback
  },
  getInfo(params) {
    return cryptapi.get('/btc/info')
  }
})