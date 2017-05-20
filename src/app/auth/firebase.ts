import * as firebase from 'firebase';

let _window :any = window;

let firebaseConfig = {
  apiKey : _window.FIREBASE_CONFIG_API_KEY,
  authDomain : _window.FIREBASE_CONFIG_AUTH_DOMAIN,
  databaseURL : _window.FIREBASE_CONFIG_DATABASE_URL,
  projectId : _window.FIREBASE_CONFIG_PROJECT_ID,
  storageBucket : _window.FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId : _window.FIREBASE_CONFIG_MESSAGING_SENDER_ID
};

export class FirebaseApp implements firebase.app.App {
  auth: () => firebase.auth.Auth;
  
  // aren't currently used in this app:
  name: string;
  options: {};
  database: () => firebase.database.Database;
  messaging: () => firebase.messaging.Messaging;
  storage: () => firebase.storage.Storage;
  delete: () => firebase.Promise<any>;
  
  constructor() {
    // in firebase.ts constructor
    return firebase.initializeApp(firebaseConfig);
  }
}

