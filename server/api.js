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
    if (!data) {
      res.send({error:"no data"});
      return;
    }
    try{
      var ksToken = JSON.parse(data);
    }catch(err){
      res.send({error:err});
      return;
    }
    if (!ksToken) {
      res.send({error:"invalid data"});
      return;
    }
    var sliceSize, key, imgData = '';

    if (!ksToken.x) { // knitskill ver.1
      sliceSize = ksToken.s ^ 0xe1;
      key = ksToken.k ^ 0x7b;
      imgData = Buffer.from(ksToken.data, "base64");
    }
    else if (ksToken.x ^ 0x87 === 2) { // knitskill ver.2?
      var ver2EncKey = [
        115,  20,   8,  11, 237,  45,  17,   8, 184, 170,
         41, 227, 239, 247,  47,  48, 246,  68, 162, 195,
         35,  28,  28,  79, 105, 142, 103, 238, 187,  62,
         94, 233,  72, 114, 203, 163, 135,  88, 255,  74,
        188,  66,  49,  39,  86, 186, 152, 189, 134,  52,
        185, 222, 154,  86, 230, 227,  58,  54, 212, 175,
        175, 231, 224, 121, 111,  69, 104,  42, 109, 105,
        247, 219,   7,  47, 237,  41,  35, 162, 249, 159,
         72, 214,  96,  68, 159,  79,   1, 153, 241, 233,
        189, 142, 222, 192, 162, 193,  28,  43, 147, 116
      ];
      sliceSize = ksToken.w ^ 0x4e;
      key = ksToken.h ^ 0xbb;

      var tempData = Buffer.from(ksToken.data, 'base64');
      for(var i = 0; i < tempData.length; i++) {
        imgData += String.fromCharCode(tempData[i] ^ ver2EncKey[i % ver2EncKey.length]);
      }
      imgData = Buffer.from(imgData, 'binary')
    }

    Jimp.read(imgData, function(err, img){
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
          var srcSliceNo;
          if(!ksToken.x)
            srcSliceNo = (key * verticalCount + dstSliceNo + (horizontalCount + 1) * dstSliceNo * key) % (horizontalCount * verticalCount);
          else if(ksToken.x ^ 0x87 === 2)
            srcSliceNo = (key * (key - 1) * verticalCount + dstSliceNo + (horizontalCount + 1) * dstSliceNo * key) % (horizontalCount * verticalCount);

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


