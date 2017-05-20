import { environment } from './../../environments/environment';
let _window: any = window;

let apiKey = environment.FIREBASE_API_KEY;
let authDomain = environment.FIREBASE_AUTH_DOMAIN;
let databaseURL = environment.FIREBASE_DATABASE_URL;
let projectId = environment.FIREBASE_PROJECT_ID;
let storageBucket = environment.FIREBASE_STORAGE_BUCKET;
let messagingSenderId = environment.FIREBASE_MESSAGING_SENDER_ID;

if (!environment.production) {
  apiKey = _window.FIREBASE_CONFIG_API_KEY;
  authDomain = _window.FIREBASE_CONFIG_AUTH_DOMAIN;
  databaseURL = _window.FIREBASE_CONFIG_DATABASE_URL;
  projectId = _window.FIREBASE_CONFIG_PROJECT_ID;
  storageBucket = _window.FIREBASE_CONFIG_STORAGE_BUCKET;
  messagingSenderId = _window.FIREBASE_CONFIG_MESSAGING_SENDER_ID;
}

export let firebaseConfig = {
  apiKey : apiKey,
  authDomain : authDomain,
  databaseURL : databaseURL,
  projectId : projectId,
  storageBucket : storageBucket,
  messagingSenderId : messagingSenderId
};

