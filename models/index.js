const Transactions = require('./transactions')
const Secrets = require('./secrets')
const { CreateMemtable } = require('./utils')

// NOTE: config will later be used for database credentials.
module.exports = (config = {}) => {
  return {
    transactions: Transactions(config, CreateMemtable()),
    secrets: Secrets(config, CreateMemtable())
  }
}