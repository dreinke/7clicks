const request = require('request');
const cheerio = require('cheerio');

const maxClicks = 7;
const checked = [];

const parse = async (url, target, clicks) => {
  target = decodeURI(target);
  url = decodeURI(url);
  clicks = clicks || 0;

  if (clicks < maxClicks) {
    const body = await new Promise((pRes) =>
      request(url, (e, r, b) => pRes(e?'':b))
    );

    const $ = cheerio.load(body);
    const links = $('#bodyContent a[href^="/wiki/"]:not([href*=":"])');

    for(var i=0; links.length && i<links.length; i++) {
      var href = decodeURI('https://pt.wikipedia.org' + links[i].attribs.href);

      if (checked.indexOf(href) == -1) {
        checked.push(href);

        if (href == target) {
          return href;
        }

        var result = await parse(href, target, clicks+1);
        if (result) {
          return href + '\n' + Array(clicks).join(' ') + result;
        }
      }
    }
  }

  return false;
}

// Example
const startHere = 'https://pt.wikipedia.org/wiki/Dan%C3%A7ador-de-coroa-dourada';
const endHere = 'https://pt.wikipedia.org/wiki/Os_Sete_An%C3%B5es';
parse(startHere,endHere).then(console.log);
