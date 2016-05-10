var proxy = require('express-http-proxy');
const express = require('express');
const maru = require('./maru')
const apicache = require('apicache');
const cors = require('cors')
const app = express();
const urlencode = require('urlencode');

app.use(cors());
app.disable('etag');
app.set('port', (process.env.PORT || 54021));
app.use(express.static(`${__dirname}/../`));

var cache = null;

cache = apicache.options({
  defaultDuration: 60*10*1000,
}).middleware;

app.get('/api/manga_list', cache(), function(req, res){
  maru.manga_list(function(err, list){
    if (err){
      res.send({error:err});
    }
    else {
      res.send({list:list});
    }
  });
});

app.get('/api/manga', cache(), function(req, res){
  maru.manga_detail(req.query['href'], function(err, data){
    if(err) {
      res.send({error:err});
    }
    else {
      res.send(data);
    }
  })
});

app.get('/api/images', cache(), function(req, res){
  var href = req.query['href'];
  maru.image_list(
    href, 
    function(err, data){
      if (err) {
        res.send({error:err});
      }
      else {
        res.send({images:data});
      }
    });

});


function encodePath(path){
  var comps = path.split('/');
  comps = comps.map(function(value){
    return urlencode(value);
  });

  return comps.join("/");
}

app.get(/preview(\/.*)/, proxy('www.marumaru.in', {
  forwardPath: function(req, res){
    return encodePath(req.params[0]);
  },
  decorateRequest: function(req){
    delete req.headers['referer'];
  }
}));

app.get(/image(\/.*)/, proxy('www.yuncomics.com', {
  forwardPath: function(req, res){
    return encodePath(req.params[0]);
  },
  decorateRequest: function(req){
    delete req.headers['referer'];
  }
}))

module.exports = app;


