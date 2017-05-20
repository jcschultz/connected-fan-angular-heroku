const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
let devConfig;

if (!process.env.PORT) {
  devConfig = require('./env');
}

let api = require('./server/routes/api');
let firebaseApp = require('./server/modules/firebase');

const forceSSL = function () {
  return function (req, res, next) {
    if (process.env.PORT && req.headers['x-forwarded-proto'] !== 'https') {
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

firebaseApp.initApp();

app.use('/api', api);

app.get('/firebaseConfig.js', function(req, res){
  let FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || devConfig.FIREBASE_API_KEY;
  let FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN || devConfig.FIREBASE_AUTH_DOMAIN;
  let FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL || devConfig.FIREBASE_DATABASE_URL;
  let FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || devConfig.FIREBASE_PROJECT_ID;
  let FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || devConfig.FIREBASE_STORAGE_BUCKET;
  let FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID || devConfig.FIREBASE_MESSAGING_SENDER_ID;
  
  res.write('var FIREBASE_CONFIG_API_KEY = "' + FIREBASE_API_KEY + '";' + '\n');
  res.write('var FIREBASE_CONFIG_AUTH_DOMAIN = "' + FIREBASE_AUTH_DOMAIN + '";' + '\n');
  res.write('var FIREBASE_CONFIG_DATABASE_URL = "' + FIREBASE_DATABASE_URL + '";' + '\n');
  res.write('var FIREBASE_CONFIG_PROJECT_ID = "' + FIREBASE_PROJECT_ID + '";' + '\n');
  res.write('var FIREBASE_CONFIG_STORAGE_BUCKET = "' + FIREBASE_STORAGE_BUCKET + '";' + '\n');
  res.write('var FIREBASE_CONFIG_MESSAGING_SENDER_ID = "' + FIREBASE_MESSAGING_SENDER_ID + '";' + '\n');
  res.end();
  
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
