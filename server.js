const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

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

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
