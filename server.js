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

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
