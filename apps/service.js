const assert = require('assert')
const cryptapi = require('cryptapi')()
const { transactions } = require('../models')()
// const { loop, ONE_MINUTE_MS } = require('../libs/utils')

module.exports = async config => {
  console.log(config)
  const { callbackURL, btcAddress } = config
  assert(callbackURL, 'requires callbackURL')

  return {
    async handleCallback({ txid, ...params }) {
      console.log('handleCallback', txid, params)
      return transactions.update(txid, {
        conirmations: params.conirmations,
        txidIn: params.txid_in,
        txidOut: params.txid_out,
        value: params.value,
        valueForwarded: params.value_forwarded
      })
    },
    async getTransaction({ transactionid }) {
      return transactions.get(transactionid)
    },
    async listTransactions() {
      return [...transactions.values()]
    },
    async listTransactionsByType(type = 'btc') {
      return transactions.getBy('type', type)
    },
    async btcCreateTransaction({ amount }) {
      amount = parseFloat(amount)
      assert(amount >= config.btcLimitAmount, `requires amount of at least ${config.btcLimitAmount} btc`)

      const tx = transactions.create(amount, btcAddress)
      const api = await cryptapi.btcCreateAddress(btcAddress, `${callbackURL}?txid=${tx.id}`)
      return transactions.update(tx.id, {
        type: 'btc',
        from: api.address_in,
        to: api.address_out,
        callbackURL: api.callback_url,
        status: api.status,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bitcoin:${api.address_in}?amount=${amount}`
      })
    },
    async btcGetInfo() {
      return cryptapi.btcInfo()
    },
    async btcLogs({ callback }) {
      return cryptapi.btcLogs(callback)
    },
  }
}