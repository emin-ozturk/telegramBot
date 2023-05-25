const dotenv = require('dotenv')
const TelegramBot = require('node-telegram-bot-api')

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

bot.onText(/\/doviz/, (msg) => {
  const chatId = msg.chat.id
  const message = 1+2
  
  bot.sendMessage(chatId, message)
})

bot.onText(/\/eczane (.+)/, async (msg, match) => {
  const chatId = msg.chat.id
  const provinceAndDistrict = match[1]

  const pharmacies = await SentryPharmacy.fetchData(provinceAndDistrict)

  if (checkKey(pharmacies, 'status')) {
    if (!pharmacies.status) {
      bot.sendMessage(chatId, pharmacies.message)
      return
    } 
  }
  sendMessage(chatId, pharmacies)
  
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