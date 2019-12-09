const assert = require('assert')
const cryptapi = require('cryptapi')()
const { transactions, secrets } = require('../models')()
// const { loop, ONE_MINUTE_MS } = require('../libs/utils')

module.exports = async config => {
  console.log(config)
  const { callbackURL, btcAddress } = config
  assert(callbackURL, 'requires callbackURL')

  return {
    async handleCallback({ txid, secret, ...params }) {
      console.log('handleCallback', txid, params)

      // does the tx exist? 
      const tx = transactions.get(txid)
      assert(tx, `no transaction found using id:${txid}`)
      
      /// does the secret match?
      const secret = secrets.get(secret)
      assert(secret, `secret not found`)
      assert(secret.txid === txid, `invalid secret found for id:${txid}`)

      // if the tx and secret are valid, we allow the caller to update the state.
      return transactions.set({
        ...tx,
        confirmations: params.confirmations,
        txidIn: params.txid_in,
        txidOut: params.txid_out,
        value: params.value,
        valueForwarded: params.value_forwarded,
        status: params.confirmations > 1 ? 'completed' : 'waitConfirmations'
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
    async btcCreateTransaction({ amount, to, from }) {
      amount = parseFloat(amount)
      assert(amount >= config.btcLimitAmount, `requires amount of at least ${config.btcLimitAmount} btc`)

      // create a tx and secret to pass to our trusted caller.
      const tx = transactions.create(amount, btcAddress)
      const secret = secrets.create(tx.id)

      // call our payment processor including the secret.
      const api = await cryptapi.btcCreateAddress(btcAddress, `${callbackURL}?txid=${tx.id}&secret=${secret.id}`, {pending: 1})

      // save the caller's resoponse so we can reference it later.
      return transactions.update(tx.id, {
        type: 'btc',
        from: api.address_in,
        to: api.address_out,
        callbackURL: api.callback_url,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bitcoin:${api.address_in}?amount=${amount}`,
        // to, from // if the user wants a custom reciving address
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