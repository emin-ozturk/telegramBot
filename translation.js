function turkishToEnglish(text) {
    const turkishChars = {
      'ç': 'c',
      'Ç': 'C',
      'ğ': 'g',
      'Ğ': 'G',
      'ı': 'i',
      'İ': 'I',
      'ö': 'o',
      'Ö': 'O',
      'ş': 's',
      'Ş': 'S',
      'ü': 'u',
      'Ü': 'U',
    };
  
    return text.replace(/[çÇğĞıİöÖşŞüÜ]/g, function (char) {
      return turkishChars[char] || char;
    })
}

module.exports = {
    turkishToEnglish
}
  

  