const { CreateMemtable } = require('./utils')
const Transactions = require('./transactions')

// NOTE: config will later be used for database credentials.
module.exports = (config={}) => {
  transactions: Transactions(config, CreateMemtable())
}