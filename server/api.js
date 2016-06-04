var proxy = require('express-http-proxy');
const express = require('express');
const maru = require('./maru')
const apicache = require('apicache');
const cors = require('cors')
const app = express();
const urlencode = require('urlencode');
const Jimp = require('jimp');

app.use(cors());
app.disable('etag');
app.set('port', (process.env.PORT || 54021));
app.use(express.static(`${__dirname}/../`));
app.use(express.static(`${__dirname}/../app`));

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
}));

app.get("/dat", function(req, res){
  var url = req.query['url'];
  maru.download(url, function(err, data){
    var table = JSON.parse(data);
    var data = new Buffer(table["data"], "base64");
    var sliceSize = table["s"] ^ 0xe1;
    var key = table["k"] ^ 0x7b;
    if (!data) {
      res.send({error:"no data"});
      return;
    }
    
    Jimp.read(data, function(err, img){
      if(err){
        res.send({error:"not image"});
        return;
      }
      var width = img.bitmap.width;
      var height = img.bitmap.height;
      var horizontalCount = Math.floor(width / sliceSize);
      var verticalCount = Math.floor(height / sliceSize);
      
      var canvas = new Jimp(width, height)
      for (var x = 0; x < horizontalCount; x++) {
        for (var y = 0; y < verticalCount; y++) {
          var dstSliceNo = x + y * horizontalCount;
          var srcSliceNo = (key * verticalCount + dstSliceNo + (horizontalCount + 1) * dstSliceNo * key) % (horizontalCount * verticalCount);
          var xpos = srcSliceNo % horizontalCount;
          var ypos = Math.floor(srcSliceNo / horizontalCount);
          canvas.blit(
            img,
            x * sliceSize, y * sliceSize,
            xpos * sliceSize, ypos * sliceSize,
            sliceSize, sliceSize)
        }
      }

      canvas.quality(60);
      canvas.getBuffer(Jimp.MIME_JPEG, function(err, buffer){
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(buffer, 'binary');
      });
    });
  });
});

module.exports = app;


