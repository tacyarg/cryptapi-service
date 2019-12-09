const assert = require('assert')
const cryptapi = require('cryptapi')()
const { loop, ONE_MINUTE_MS, parseUSD } = require('../libs/utils')

module.exports = async config => {
  console.log(config)
  const { callbackURL } = config
  assert(callbackURL, 'requires callbackURL')

  const { transactions, secrets } = require('../models')(config)

  // cache the exchange rates for btc every min
  let EXCHANGE_RATES = {}
  loop(async () => {
    const tickers = cryptapi.getSupportedTickers()

    for (t of tickers) {
      const { prices } = await cryptapi._getInfo(t)
      // console.log('_getInfo', t, prices)
      const keys = Object.keys(prices)
      EXCHANGE_RATES[t] = keys.reduce((memo, k) => {
        memo[k] = parseFloat(prices[k])
        return memo
      }, {})
    }

  }, ONE_MINUTE_MS)


  const listTickers = () => {
    return Object.keys(EXCHANGE_RATES)
  }

  const isTickerValid = t => {
    return EXCHANGE_RATES[t]
  }

  const getExchangeRates = (ticker, currency = 'USD', amount = 1) => {
    const rates = EXCHANGE_RATES[ticker]
    return currency ? parseUSD(rates[currency] * amount) : rates
  }

  // public API
  return {
    async getSupportedTickers() {
      return cryptapi.getSupportedTickers()
    },
    async getTickerExchangeRates({ ticker, currency, amount }) {
      const _error = `Please provide one of the following tickers: ${listTickers()}`
      assert(ticker, _error)
      assert(EXCHANGE_RATES[ticker], _error)
      assert(EXCHANGE_RATES[ticker][currency], _error)

      return getExchangeRates(ticker, currency, amount)
    },
    async handleCallback({ txid, secret, ...params }) {
      console.log('handleCallback', txid, params)

      // does the tx exist? 
      const tx = transactions.get(txid)
      assert(tx, `no transaction found using id:${txid}`)

      /// does the secret match?
      const s = secrets.get(secret)
      assert(s, `secret not found`)
      assert(s.txid === txid, `invalid secret found for id:${txid}`)

      // if the tx and secret are valid, we allow the caller to update the state.
      const confirmations = parseInt(params.confirmations) || 0
      return transactions.set({
        ...tx,
        confirmations,
        txidIn: params.txid_in,
        txidOut: params.txid_out,
        value: params.value,
        valueForwarded: params.value_forwarded,
        status: confirmations > 1 ? 'completed' : 'waitConfirmations'
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
    async createTransaction({ ticker, amount, to, from }) {
      assert(ticker, `Please provide one of the following tickers: ${listTickers()}`)
      assert(isTickerValid(ticker), `Please provide one of the following tickers: ${listTickers()}`)

      amount = parseFloat(amount)
      assert(amount >= config.coinLimit, `requires amount of at least ${config.coinLimit} btc`)

      const fiatValue = getExchangeRates(ticker, 'USD', amount)

      // create a tx and secret to pass to our trusted caller.
      const address = config[`${ticker}Address`]
      assert(address, 'please provide the supported ticker address in your .env')

      const tx = transactions.create(amount, address)
      const secret = secrets.create(tx.id)

      // call our payment processor including the secret.
      const api = await cryptapi._createAddress(ticker, address, `${callbackURL}?txid=${tx.id}&secret=${secret.id}`, { pending: 1 })
      assert(api, 'cryptapi._createAddress failure')
      assert(api.address_in, 'cryptapi._createAddress failure')

      // save the caller's resoponse so we can reference it later.
      return transactions.update(tx.id, {
        fiatValue,
        type: 'btc',
        from: api.address_in,
        to: api.address_out,
        callbackURL: api.callback_url,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=bitcoin:${api.address_in}?amount=${amount}`,
        // to, from // if the user wants a custom reciving address
      })
    }
  }
}