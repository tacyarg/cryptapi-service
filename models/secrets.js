const uuid = require('uuid/v4')
const assert = require('assert')
const lodash = require('lodash')

const Defaults = p => {
  return {
    id: uuid(),
    created: Date.now(),
    updated: Date.now(),
    ...p
  }
}

module.exports = (config, table) => {
  return {
    ...table,
    create(txid) {
      const tx = Defaults({ txid })
      return table.set(tx)
    }
  }
}

