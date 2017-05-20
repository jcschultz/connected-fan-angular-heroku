
// these are specific to this app. they should be changed for any other projects/apps.
// i don't like storing these here, even though they aren't secrets. they're visible
// in the browser. but i'd prefer to have them in a process.env variable. for some
// reason that has cost me hours, all the tricks i could find with pulling these from
// heroku's config vars didn't work. so i give up!
export let firebaseConfig = {
  apiKey : 'AIzaSyB3XuGiYtBjUiOedurig5Fk9QhAs5mR2_0',
  authDomain : 'connected-fan.firebaseapp.com',
  databaseURL : 'https://connected-fan.firebaseio.com',
  projectId : 'connected-fan',
  storageBucket : 'connected-fan.appspot.com',
  messagingSenderId : '586221658419'
};

