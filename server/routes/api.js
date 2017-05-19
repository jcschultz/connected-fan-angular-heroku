let express = require('express');
let router = express.Router();
let superagent = require('superagent');
let request = require('request-promise-native');

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

const auth0Data = {
  client_id: process.env.AUTH0_FAN_CLIENT_ID,
  client_secret: process.env.AUTH0_FAN_CLIENT_SECRET,
  grant_type: process.env.AUTH0_GRANT_TYPE,
  audience: process.env.AUTH0_FAN_AUDIENCE
}

const validActions = ['high', 'medium', 'low', 'off'];

let fanIpAddress = null;

function sendRequest(path) {
  //return new Promise((resolve, reject) => {
    // superagent
    //   .get(fanIpAddress + ':' + process.env.IP_MACHINE_PORT + path)
    //   .set('Authorization', 'Bearer ' + req.access_token)
    //   .then(function(data) {
    //     if(data.status !== 200){
    //       reject(data)
    //     }
    //     else {
    //       resolve();
    //     }
    //   });
    let uri = fanIpAddress + ':' + process.env.IP_MACHINE_PORT + path;
    let options = {
      method: 'GET',
      uri: uri,
      auth: {
        bearer: req.access_token
      }
    };
    
    console.log('@@@ BEGIN SEND API REQUEST INFO @@@');
    console.log('uri', uri);
    console.log('options', options);
    console.log('@@@ BEGIN SEND API REQUEST INFO @@@');
    
    return request(options);
  //});
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
  // superagent
  //   .post(process.env.AUTH0_CLIENT_TOKEN_URL)
  //   .send(auth0Data)
  //   .then(function(tokenResponse) {
  //     if(tokenResponse && tokenResponse.body && tokenResponse.body.access_token){
  //       req.access_token = tokenResponse.body.access_token;
  //       next();
  //     }
  //     else {
  //       res.status(401).send('Unauthorized');
  //     }
  //   })
  console.log('@@@ INSIDE AUTH0 TOKEN REQUEST @@@');
  let options = {
    method: 'POST',
    uri: process.env.AUTH0_CLIENT_TOKEN_URL,
    json: auth0Data
  };
  
  request(options)
    .then((response) => {
      if (response && response.access_token) {
        req.access_token = response.body.access_token;
        next();
      }
      else {
        console.log('@@@ BEGIN MISSING ACCESS_TOKEN FROM AUTH0 ACCESS_TOKEN REQUEST @@@');
        console.log(response);
        console.log('@@@ END MISSING ACCESS_TOKEN FROM AUTH0 ACCESS_TOKEN REQUEST @@@');
        return res.status(401).json(response);
      }
    })
    .catch((err) => {
      console.log('@@@ BEGIN ERROR FROM AUTH0 ACCESS_TOKEN REQUEST @@@');
      console.log(err);
      console.log('@@@ END ERROR FROM AUTH0 ACCESS_TOKEN REQUEST @@@');
      res.status(401).json(err);
    });
});

// middleware to get ip address of connected fan
router.use(function(req, res, next) {
  // superagent
  //   .get(process.env.IP_TRACKER_URL + '/' + process.env.IP_MACHINE_NAME)
  //   .then(function(data) {
  //     if (!data || data.status === 404 || !data.body || !data.body.address) {
  //       return res.status(500).send('The connected fan could not be found');
  //     }
  //
  //     fanIpAddress = data.body.address;
  //     next();
  //   });
  console.log('@@@ INSIDE IP TRACKER REQUEST @@@');
  let uri = process.env.IP_TRACKER_URL + '/' + process.env.IP_MACHINE_NAME;
  
  request(uri)
    .then((response) => {
      if (!response || !response.body || !response.body.address) {
        return res.status(500).send('The connected fan could not be found');
      }

      fanIpAddress = response.body.address;
      next();
    })
    .catch((err) => {
      console.log('@@@ BEGIN ERROR FROM IP TRACKER REQUEST @@@');
      console.log(err);
      console.log('@@@ END ERROR FROM IP TRACKER REQUEST @@@');
      res.status(500).json(err);
    });
});

router.put('/fan/:action', function (req, res, next) {
  let action = req.params.action;
  
  if (validActions.indexOf(action) < 0) {
    return res.status(500).send('Invalid action');
  }
  
  sendRequest('/fan/' + action)
    .then((response) => {
      res.status(200).send('success');
    })
    .catch((err) => {
      console.log('@@@ BEGIN ERROR FROM FAN API REQUEST @@@');
      console.log(err);
      console.log('@@@ END ERROR FROM FAN API REQUEST @@@');
      res.status(500).json(err);
    });
});

router.put('/light', function (req, res, next) {
  console.log('@@@ INSIDE LIGHT API REQUEST @@@');
  sendRequest('/light')
    .then((response) => {
      res.status(200).send('success');
    })
    .catch((err) => {
      console.log('@@@ BEGIN ERROR FROM LIGHT API REQUEST @@@');
      console.log(err);
      console.log('@@@ END ERROR FROM LIGHT API REQUEST @@@');
      res.status(500).json(err);
    });
});

module.exports = router;
