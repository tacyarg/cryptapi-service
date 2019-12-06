const unirest = require('unirest');
const assert = require('assert')
const join = require("url-join")

module.exports = (config = {}) => {
  assert(config.baseURL, 'requires config.baseURL')

  return {
    post: (endpoint, params = {}) => {
      assert(endpoint, 'endpoint required')
      return new Promise((resolve, reject) => {
        const url = join(config.baseURL, endpoint)
        
        unirest.post(url)
          .type('json')
          .send(params)
          .end(({ error, body }) => {
            if (error) reject(error)
            else resolve(body)
          });
      })
    },
    get: (endpoint, params = {}) => {
      return new Promise((resolve, reject) => {
        assert(endpoint, 'endpoint required')
        const url = join(config.baseURL, endpoint)

        unirest.get(url)
          .query(params)
          .end(({ error, body }) => {
            if (error) reject(error)
            else resolve(body)
          });
      })
    },
  }
}