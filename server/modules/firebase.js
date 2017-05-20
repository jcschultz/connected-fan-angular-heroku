let admin = require('firebase-admin');
let devConfig;

if (!process.env.PORT) {
  devConfig = require('./../../env');
}

const serviceAccount = {
  "type": process.env.FIREBASE_TYPE || devConfig.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID || devConfig.FIREBASE_PROJECT_ID,
  'private_key_id': process.env.FIREBASE_PRIVATE_KEY_ID || devConfig.FIREBASE_PRIVATE_KEY_ID,
  'private_key': process.env.FIREBASE_PRIVATE_KEY || devConfig.FIREBASE_PRIVATE_KEY,
  'client_email': process.env.FIREBASE_CLIENT_EMAIL || devConfig.FIREBASE_CLIENT_EMAIL,
  'client_id': process.env.FIREBASE_CLIENT_ID || devConfig.FIREBASE_CLIENT_ID,
  'auth_uri': process.env.FIREBASE_AUTH_URI || devConfig.FIREBASE_AUTH_URI,
  'token_uri': process.env.FIREBASE_TOKEN_URI || devConfig.FIREBASE_TOKEN_URI,
  'auth_provider_x509_cert_url': process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || devConfig.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  'client_x509_cert_url': process.env.FIREBASE_CLIENT_X509_CERT_URL || devConfig.FIREBASE_CLIENT_X509_CERT_URL,
};

module.exports = {
  initApp: function() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || devConfig.FIREBASE_DATABASE_URL
    });
  },
  
  verifyIdToken: function(token) {
    return admin.auth().verifyIdToken(token);
  }
};
