const axios = require('axios')
const cheerio = require('cheerio')

async function fetchData(provinceAndDistrict) {
    try {
      const response = await axios.get('https://www.doviz.com/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
        }
      })
  
        const html = response.data
  
        const $ = cheerio.load(html)
        const EUR_USD = $('[data-socket-key="gram-altin"]')

        console.log(EUR_USD)
      
      
      const pharmacies = []
      EUR_USD.each((index, element) => {
        pharmacies.push({
          'EUR_USD': $(EUR_USD[index]).html(),
  
        })
        console.log($(EUR_USD[index]).html())
      })
  
    //   return pharmacies 
      
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
  
  