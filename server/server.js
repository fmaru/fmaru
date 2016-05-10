const api = require('./api');
api.listen(api.get('port'), function() {
  console.log('Node api is running on port', api.get('port'));
});

