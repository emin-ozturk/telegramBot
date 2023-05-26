const dotenv = require('dotenv')
const TelegramBot = require('node-telegram-bot-api')

const Currency = require('./currency')
const SentryPharmacy = require('./sentry-pharmacy')
dotenv.config()

const API_TOKEN = process.env.API_TOKEN
const bot = new TelegramBot(API_TOKEN, { polling: true })

bot.onText(/\/secenek/, (msg) => {
  const chatId = msg.chat.id
  const message = ' Kullanabileceğiniz komutlar ve kullanım şekilleri aşağıdaki gibidir.\n\n'
                  + '/doviz \n Döviz kurları hakkında bilgi \n\n /eczane il-ilçe \n'
                  + ' Girilen bölgedeki nöbetçi eczaneler'
  
  bot.sendMessage(chatId, message)
})

bot.onText(/\/doviz/, async (msg) => {
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

bot.onText(/\/eczane (.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  const provinceAndDistrict = match[1]

  if (!isThereADistrict(provinceAndDistrict)) {
    bot.sendMessage(chatId, 'Eksik veri girişi')
    return
  }

  const pharmacies = await SentryPharmacy.fetchData(provinceAndDistrict.toLowerCase())

  if (checkKey(pharmacies, 'status')) {
    if (!pharmacies.status) {
      bot.sendMessage(chatId, pharmacies.message)
      return
    } 
  }

  try {
    sendMessage(chatId, pharmacies)
  } catch (error) {
    console.log(error)
    sendMessage(chatId, 'Bir şeyler ters gitti, tekrar deneyin.')
  }
})

sendMessage = (chatId, pharmacies) => {
  var message = ''
  pharmacies.forEach(pharmacy => {
    message += pharmacy.name + '\n' + pharmacy.tel + '\n' + pharmacy.address + '\n\n'
  })
  bot.sendMessage(chatId, message)
}

checkKey = (obj, key) => {
  return obj.hasOwnProperty(key)
}

isThereADistrict = (provinceAndDistrict) => {
  const array = provinceAndDistrict.split('-')
  if (array.lenght == 0 || array.lenght == 1) {
    return false
  }
  return true
}