# CryptAPI-Service Introduction
This service is a thin layer on top of the [cryptapi](https://cryptapi.io/) cryptocurrency payment gateway.
Internally we utilize our Nodejs Library [cryptapi](https://github.com/tacyarg/cryptapi), to get started you may want to have a look there.

## What does this service do?
This service allows anyone to easliy start and maintain a fully functional payment gatewayAPI. Create transactions, process payments, using any currency supported by cryptapi.

## What problem does this solve?
This service solves the problem of not having a way to transactionally facillitate deposits & withdraws using the cryptapi. This thin layer uses our wrapper and some logic to create an abstraction. This abstractions allows our service to provice a simple and easy to use api without having low-level understanding of cryptAPI.

## WHy would I use this insted of the api directly?
We maintain and support this library for you here at [ChipSoft](https://chips.gg). This allows you to focus on intigrating payment solutions rather than worrying about the implementation details. Using this lib, you can have a working payment processed in minutes, no signup required.


# Installation & Use
Below is a simple guide on how to install and utilize the service.

### 1. Installation

```bash
yarn add cryptapi-service
```

### 2. Setup .ENV
```env
btcAddress=1APT1UoYgA8tJEnN1qe8rcvaN55NoASDju
ethAddress=0xf01515AEd668B4314B265d8A56D9d9cA2e86cDf4
bchAddress=qpjclvz364jtqjseah7crjnvs44tnp4fpqusj85zeq
xlmAddres=GAHMQG6JABBXJJ2HT3GWTKSQO2MRY55SINL6F3BIJPKTFTOHCMKPFZIP

callbackURL=https://localhost:3000/handleCallback
port=3000
name=service

btcLimitAmount=0.0001
```

### 3. Startup

```js
yarn service
npm start service
```