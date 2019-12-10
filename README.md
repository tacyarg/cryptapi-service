# CryptAPI-Service Introduction
This service is a thin layer on top of the [cryptapi](https://cryptapi.io/) cryptocurrency payment gateway.
Internally we utilize our Nodejs Library [cryptapi](https://github.com/tacyarg/cryptapi), to get started you may want to have a look there.

> Bitcoin, Bitcoin Cash, Litecoin, Ethereum, Monero, IOTA, ...

## What does this service do?
This service allows anyone to easliy start and maintain a fully functional payment gatewayAPI. Create transactions, process payments, using any currency supported by cryptapi. Simply start the service, interact with the api, and process crypto payments.

## What problem does this solve?
This service solves the problem of not having a way to transactionally facillitate deposits & withdraws using the [cryptapi](https://cryptapi.io/). This thin layer uses our wrapper and some application logic to create an abstraction. This abstraction allows our service to provide a simple and easy to use api, without having low-level understanding of the underlying [cryptapi](https://github.com/tacyarg/cryptapi).

## Why would I use this insted of the api directly?
When using the [cryptapi](https://cryptapi.io/) directy, by design, you have no way historically obtain transactions other than by using the `callbackURL` to listen for completed transactions and storing that locally. When having to do this, it makes things complicated to store and trace due to the requirement of always needing to have a listener online. This service solves this by allowing you to replicate horizontally with a basic efemeral instance.

## How do I know this code is stable?
We maintain and support this library for you, here at [ChipSoft](https://chips.gg). This allows you to focus on intigrating payment solutions rather than worrying about the implementation details. Using this lib, you can have a working payment processed in minutes, no signup required.


# Installation & Use
Below is a simple guide on how to install and utilize the service.

### 1. Installation

```bash
yarn add cryptapi-service
```

### 2. Setup .ENV
```env
btcAddress=
ethAddress=
bchAddress=
xlmAddres=

callbackURL=https://localhost:3000/handleCallback
port=3000
name=service

coinLimit=0.001
currency=USD
```

### 3. Startup

```js
yarn service
npm start service
```

# Maintenance 
The main drawback of [cryptapi](https://cryptapi.io/) is that this service has a requirement to remain online at all times. With its low overhead and simple deployment, this task is easily managed with kubernetes. Additionally, we recommend a management layer be maintained in your application. This service will allow you to recover any missed payments in the event of network failure. **See [cryptapi](https://github.com/tacyarg/cryptapi) For More Details.** 

-----

### NOTICE
> In a future update we plan to attempt "auto-recovery" to handle this event for you. Each "transaction" creates a unique `callbackURL`, doing so, we should be able to recover the complete blockchain history for that address as long as we resume service within a realatively timely manor. For the time being, you will need to do that yourself.

