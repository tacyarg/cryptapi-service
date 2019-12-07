const Transactions = require('./transactions')
const { CreateMemtable } = require('./utils')

// NOTE: config will later be used for database credentials.
module.exports = (config = {}) => {
  return {
    transactions: Transactions(config, CreateMemtable())
  }
}