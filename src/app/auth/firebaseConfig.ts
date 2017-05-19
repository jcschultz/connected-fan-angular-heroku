let _window :any = window;

export let firebaseConfig = {
  apiKey : _window.FIREBASE_CONFIG_API_KEY,
  authDomain : _window.FIREBASE_CONFIG_AUTH_DOMAIN,
  databaseURL : _window.FIREBASE_CONFIG_DATABASE_URL,
  projectId : _window.FIREBASE_CONFIG_PROJECT_ID,
  storageBucket : _window.FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId : _window.FIREBASE_CONFIG_MESSAGING_SENDER_ID
};
