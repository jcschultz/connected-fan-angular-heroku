let express = require('express');
let router = express.Router();
let superagent = require('superagent');

let admin = require('firebase-admin');

const serviceAccount = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  'private_key_id': process.env.FIREBASE_PRIVATE_KEY_ID,
  'private_key': process.env.FIREBASE_PRIVATE_KEY,
  'client_email': process.env.FIREBASE_CLIENT_EMAIL,
  'client_id': process.env.FIREBASE_CLIENT_ID,
  'auth_uri': process.env.FIREBASE_AUTH_URI,
  'token_uri': process.env.FIREBASE_TOKEN_URI,
  'auth_provider_x509_cert_url': process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  'client_x509_cert_url': process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

const authData = {
  client_id: process.env.AUTH0_FAN_CLIENT_ID,
  client_secret: process.env.AUTH0_FAN_CLIENT_SECRET,
  grant_type: process.env.AUTH0_GRANT_TYPE,
  audience: process.env.AUTH0_FAN_AUDIENCE
}

const validActions = ['high', 'medium', 'low', 'off'];

let fanIpAddress = null;

function sendRequest(path) {
  return new Promise((resolve, reject) => {
    superagent
      .get(fanIpAddress + ':' + process.env.IP_MACHINE_PORT + path)
      .set('Authorization', 'Bearer ' + req.access_token)
      .end(function(err, data) {
        if(data.status !== 200){
          reject(data)
        }
        else {
          resolve();
        }
      });
  });
}

// middleware to check the firebase token for client side authentication
router.use(function(req, res, next) {
  let token = req.body.token;
  
  if (!token) {
    return res.redirect('/login');
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  
  admin.auth().verifyIdToken(token)
    .then((decodedToken) => {
      next();
    })
    .catch((err) => {
      res.redirect('/login');
    });
});

// middleware to get auth0 token for fan api
router.use(function(req, res, next) {
  superagent
    .post(process.env.AUTH0_CLIENT_TOKEN_URL)
    .send(authData)
    .end(function(err, tokenResponse) {
      if(tokenResponse.body.access_token){
        req.access_token = tokenResponse.body.access_token;
        next();
      }
      else {
        res.status(401).send('Unauthorized');
      }
    })
});

// middleware to get ip address of connected fan
router.use(function(req, res, next) {
  superagent
    .get(process.env.IP_TRACKER_URL + '/' + process.env.IP_MACHINE_NAME)
    .end(function(err, data) {
      if (data.status === 404 || !data.body || !data.body.address) {
        return res.status(500).send('The connected fan could not be found');
      }
      
      fanIpAddress = data.body.address;
      next();
    });
});

router.put('/fan/:action', function (req, res, next) {
  let action = req.params.action;
  
  if (validActions.indexOf(action) < 0) {
    return res.status(500).send('Invalid action');
  }
  
  sendRequest('/fan/' + action)
    .then(() => {
      res.status(200).send('success');
    })
    .catch((data) => {
      res.status(data.status).json(data);
    })
});

router.put('/light', function (req, res, next) {
  sendRequest('/light')
    .then(() => {
      res.status(200).send('success');
    })
    .catch((data) => {
      res.status(data.status).json(data);
    })
});

module.exports = router;
