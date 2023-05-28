const dotenv = require('dotenv')
const TelegramBot = require('node-telegram-bot-api')
const Currency = require('./currency')
const SentryPharmacy = require('./sentry-pharmacy')
const express = require('express')

app = express()


app.get('/', (req, res) => {
  res.send('Başladı')
})
dotenv.config()
const API_TOKEN = process.env.API_TOKEN
const bot = new TelegramBot(API_TOKEN, { polling: true })
var STATUS = null
const STATUS_CURRENCY = 0, STATUS_SENTRY_PHARMACY = 1
const commands = ['/doviz', '/eczane']

bot.onText(/\/doviz/, async (msg) => {
  STATUS = STATUS_CURRENCY
  const chatId = msg.chat.id
  const currency = await Currency.fetchData()
  var message = 'GRAM ALTIN: ' + currency.GRAMALTIN + '\n' +
                'DOLAR: ' + currency.USD + '\n' +
                'EURO: ' + currency.EUR + '\n' +
                'STERLIN: ' + currency.STERLIN + '\n' +
                'BIST100: ' + currency.BIST100 + '\n' +
                'BITCOIN: '+ currency.BITCOIN + '\n' +
                'GRAM GÜMÜS: '+ currency.GRAMGUMUS + '\n' +
                'BRENT: '+ currency.BRENT
  bot.sendMessage(chatId, message)
})

bot.onText(/\/eczane/, async (msg, match) => {
  STATUS = STATUS_SENTRY_PHARMACY
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Arasında - işareti olacak şekilde il-ilçe adı girin.')

})

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const message = msg.text

  if (isCommand(message)) {
    return
  }

  switch (STATUS) {
    case STATUS_SENTRY_PHARMACY:
      const response  = await SentryPharmacy.getSentryPharmacy(message)
      if (checkKey(response, 'status')) {
        if (!response.status) {
          bot.sendMessage(chatId, response.message)
          return
        } 
      }
      sendSentryPharmacy(chatId, response)
      break

    case STATUS_CURRENCY:
      break
  }

})

isCommand = (message) => {
  return commands.find(command => command === message)
}

checkKey = (obj, key) => {
  return obj.hasOwnProperty(key)
}

sendSentryPharmacy = (chatId, pharmacies) => {
  var message = ''
  pharmacies.forEach(pharmacy => {
    message += pharmacy.name + '\n' + pharmacy.tel + '\n' + pharmacy.address + '\n\n'
  })
  bot.sendMessage(chatId, message)
}

app.listen(process.env.PORT || 3000, () => {
  console.log('Server başladı')
})
