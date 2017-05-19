const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

let api = require('./routes/api');

const forceSSL = function () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
        ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  };
};

app.use(forceSSL());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 3000);

app.use('/api', api);

app.get('/firebaseConfig.js', function(req, res){
  
  res.write('var FIREBASE_CONFIG_API_KEY = "' + process.env.FIREBASE_API_KEY + '";' + '\n');
  res.write('var FIREBASE_CONFIG_AUTH_DOMAIN = "' + process.env.FIREBASE_AUTH_DOMAIN + '";' + '\n');
  res.write('var FIREBASE_CONFIG_DATABASE_URL = "' + process.env.FIREBASE_DATABASE_URL + '";' + '\n');
  res.write('var FIREBASE_CONFIG_PROJECT_ID = "' + process.env.FIREBASE_PROJECT_ID + '";' + '\n');
  res.write('var FIREBASE_CONFIG_STORAGE_BUCKET = "' + process.env.FIREBASE_STORAGE_BUCKET + '";' + '\n');
  res.write('var FIREBASE_CONFIG_MESSAGING_SENDER_ID = "' + process.env.FIREBASE_MESSAGING_SENDER_ID + '";' + '\n');
  res.end();
  
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
