
// start the server
const WebServer = require('actions-http')

WebServer({
  port: 3000
}, {
  async ping(params) {
    return 'pong'
  },
  async echo(params) {
    return params
  }
})