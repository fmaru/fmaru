const unirest = require('unirest');
const Xray = require('x-ray');
const jsdom = require('jsdom');
const fs = require('fs');
const jqueryStr = fs.readFileSync(`${__dirname}/jsdom_lib/jquery.min.js`, "utf-8");


const headers = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, sdch',
  'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.6,en;q=0.4',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
}

function manga_list(cb){
  unirest.get('http://marumaru.in/c/1')
    .headers(headers)
    .send()
    .end(response => {
      if (!response.ok){
        cb(response.error, null);
        return;
      }
      const x = Xray();
      const html = response.body;
      x(html, '.widget_review01 ul li', [{
        href: 'a@href',
        title: 'div'
      }])((err, data) => {
        if (err){
          cb(err, null);
        }
        else {
          data.forEach(function (value){
            value.id = value.href.split("\/").pop();
          });
          cb(null, data);
        }
      });
    });
}

function manga_detail(href, cb){
  jsdom.env({
    url: 'http://marumaru.in' + href,
    src: [jqueryStr],
    userAgent: headers['User-Agent'],
    headers: headers,
    virtualConsole: jsdom.createVirtualConsole().sendTo(console),
    done: function(err, window){
      if (err) {
        cb(err);
        return;
      }

      const $ = window.jQuery;

      var episodes = []
      $('#vContent a').each(function(idx) {
        var title = this.textContent.trim();
        var href = this.getAttribute('href');
        if (title.length > 0 && href.indexOf('archives') > -1){
          episodes.push({
            title: title,
            href: href
          })
        }
      })

      var cover = $('#vContent img:first').attr('src');

      cb(null, {cover:cover, episodes:episodes});

    }
  })
}
const cookieJar = jsdom.createCookieJar();

function image_list(url, cb) {
  var openPage = function(){
    jsdom.env({
      url: url,
      src: [jqueryStr],
      virtualConsole: jsdom.createVirtualConsole().sendTo(console),
      cookieJar: cookieJar,
      done: function (err, window) {
        if (err) {
          cb(err);
          return;
        }
        var $ = window.jQuery;
        if (window.document.title.indexOf('You are being redirected') > -1)
        {
          document = window.document;
          location = {
            reload: function() {}
          }

          var scripts = $('script');
          scripts.each(function(idx) {
            eval(this.textContent);
          });
          openPage();
        }
        else if ($('form').attr('action'))
        {
          $.post(
            $('form').attr('action'),
            "post_password=qndxkr&Submit=Submit",
            function(data, textStatus, jqXHR)
            {
              openPage();
            }
          ).fail(function(){
            cb("error");
          });
        }
        else {
          urls = []
          var img = $('img').each(function(idx){
            url = this.getAttribute('data-lazy-src');
            if (!url){
              url = this.getAttribute("data-src");
            }
            if (url){
              urls.push(url);
            }
          });
          cb(null, urls);
        }
      }
    });
  }
  openPage();
}

function image(image_url, cb){
  unirest.get(image_url)
    .headers(headers)
    .send()
    .end(response => {
      if (!response.ok){
        cb(response.error);
        return;
      }
      
      cb(null, response.headers, response.body);
    });
}

module.exports = {
  manga_list: manga_list,
  manga_detail: manga_detail,
  image_list: image_list,
  image: image
};

