const axios = require('axios')
const cheerio = require('cheerio')

const Translation = require('./translation')

async function getSentryPharmacy(provinceAndDistrict) {

  if (!isThereADistrict(provinceAndDistrict)) {
    return {
      status: false,
      message: 'Eksik veri girişi'
    }
  }

  const pharmacies = await fetchData(provinceAndDistrict.toLowerCase())

  try {
    return pharmacies
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: 'Bir şeyler ters gitti, tekrar deneyin.'
    }
  }
}

fetchData = async (provinceAndDistrict) => {
  try {
    const response = await axios.get
      ('https://www.eczaneler.gen.tr/nobetci-' + 
        Translation.turkishToEnglish(provinceAndDistrict).trim(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
      }
    })

    const html = response.data

    const $ = cheerio.load(html)
    const active = $('.active')
    const name = active.find('.isim')
    const tel = active.find('.py-lg-2')

    
    const x = $('.border-bottom')
    const address = x.find('.col-lg-6')
    
    const pharmacies = []
    name.each((index, element) => {
      pharmacies.push({
        'name': $(element).html(),
        'tel': $(tel[index]).html(),
        'address': $(address[index]).text().trim()
      })
    })

    return pharmacies 
    
  } catch (error) {
    console.error('Veri alınamadı:', error)
    return {
      status: false,
      message: 'Sonuç bulunamadı'
    }
  }
}

isThereADistrict = (provinceAndDistrict) => {
  const array = provinceAndDistrict.split('-')
  if (array.lenght == 0 || array.lenght == 1) {
    return false
  }
  return true
}

module.exports = {
  getSentryPharmacy
}

