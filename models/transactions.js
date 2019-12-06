const uuid = require('uuid/v4')
const assert = require('assert')

const Defaults = p => {
  return {
    id: uuid(),
    created: Date.now(),
    updated: Date.now(),
    ...p
  }
}

module.exports = (config, table) => {

  table.create = to => {
    assert(to, 'requires to')
    const tx = Defaults({ to })
    return table.set(tx)
  }

  return table
}

