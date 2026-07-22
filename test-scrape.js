const cheerio = require('cheerio');
fetch('https://www.codechef.com/users/nice_trail_87', {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
})
  .then(r=>r.text())
  .then(html=>{
    const $ = cheerio.load(html);
    const currentRating = parseInt(String($('.rating-number').text())) || 0;
    console.log('Current Rating:', currentRating);
  }).catch(e=>console.error(e));
