const axios = require('axios')
const cheerio = require('cheerio')

async function fetchData() {
    try {
      const response = await axios.get('https://www.doviz.com/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
        }
      })
  
        const html = response.data
  
        const $ = cheerio.load(html)
        const GRAMALTIN = $('[data-socket-key="gram-altin"]')
        const USD = $('[data-socket-key="USD"]')
        const EUR = $('[data-socket-key="EUR"]')
        const STERLIN = $('[data-socket-key="GBP"]')
        const BIST100 = $('[data-socket-key="XU100"]')
        const BITCOIN = $('[data-socket-key="bitcoin"]')
        const GRAMGUMUS = $('[data-socket-key="gumus"]')
        const BRENT = $('[data-socket-key="BRENT"]')

        return {
          'GRAMALTIN': $(GRAMALTIN[0]).html(),
          'USD': $(USD[0]).html(),
          'EUR': $(EUR[0]).html(),
          'STERLIN': $(STERLIN[0]).html(),
          'BIST100': $(BIST100[0]).html(),
          'BITCOIN': $(BITCOIN[0]).html(),
          'GRAMGUMUS': $(GRAMGUMUS[0]).html(),
          'BRENT': $(BRENT[0]).html()
        }
      
    } catch (error) {
      console.error('Veri alınamadı:', error)
      return ({
        'status': false,
        'message': 'Hatalı veri girişi'
      })
    }
  }
  
  module.exports = {
    fetchData
  }
  
  