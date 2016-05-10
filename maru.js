var unirest = require('unirest');
var Xray = require('x-ray');

function list(cb){
  unirest.get('http://marumaru.in/c/1')
    .headers({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Host': 'marumaru.in',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
    })
    .send()
    .end(function (response){
      if (!response.ok){
        cb(response.error, null);
        return;
      }
      var x = Xray();
      var html = response.body;
      x(html, '.widget_review01 ul li', [{
        pid: '@pid',
        cid: 'a@cid',
        href: 'a@href',
        title: 'div'
      }])(function (err, data){
        if (err){
          cb(err, null);
        }
        else {
          cb(null, data);
        }
      });
    });
}

list(function(err, data){
  console.log(err);
  console.log(data.length);
})
