let express = require('express');
let router = express.Router();
let superagent = require('superagent');
let request = require('request-promise-native');
let firebaseApp = require('./../modules/firebase');

const auth0Data = {
  client_id : process.env.AUTH0_FAN_CLIENT_ID,
  client_secret : process.env.AUTH0_FAN_CLIENT_SECRET,
  grant_type : process.env.AUTH0_GRANT_TYPE,
  audience : process.env.AUTH0_FAN_AUDIENCE
};

const validActions = ['high', 'medium', 'low', 'off'];

let fanIpAddress = null;

function sendRequest(path, req) {
  
  let uri = 'http://' + fanIpAddress + ':' + process.env.IP_MACHINE_PORT + path;
  let options = {
    method : 'GET',
    uri : uri,
    auth : {
      bearer : req.access_token
    }
  };
  
  return request(options);
}

// middleware to check the firebase token for client side authentication
router.use(function (req, res, next) {
  let token = req.body.token;
  
  if (!token) {
    return res.redirect('/login');
  }
  
  firebaseApp.verifyIdToken(token)
    .then((decodedToken) => {
      next();
    })
    .catch((err) => {
      return res.redirect('/login');
    });
});

// middleware to get auth0 token for fan api
router.use(function (req, res, next) {
  
  let options = {
    method : 'POST',
    uri : process.env.AUTH0_CLIENT_TOKEN_URL,
    json : auth0Data
  };
  
  request(options)
    .then((response) => {
      if (response && response.access_token) {
        req.access_token = response.access_token;
        next();
      }
      else {
        return res.status(401).json(response);
      }
    })
    .catch((err) => {
      return res.status(401).json(err);
    });
});

// middleware to get ip address of connected fan
router.use(function (req, res, next) {
  
  let uri = process.env.IP_TRACKER_URL + '/' + process.env.IP_MACHINE_NAME;
  console.log('uri: ', uri);
  
  request(uri)
    .then((response) => {
      response = JSON.parse(response);
      if (!response || !response.address) {
        return res.status(500).json(response);
      }
      
      fanIpAddress = response.address;
      next();
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

router.put('/fan/:action', function (req, res, next) {
  let action = req.params.action;
  
  if (validActions.indexOf(action) < 0) {
    return res.status(500).send('Invalid action');
  }
  
  sendRequest('/fan/' + action, req)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put('/light', function (req, res, next) {
  sendRequest('/light', req)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
