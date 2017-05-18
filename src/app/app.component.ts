import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

const window :any = {};

@Component({
  selector : 'app-root',
  templateUrl : './app.component.html',
  styleUrls : ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  ngOnInit() {
    let firebaseConfig = {
      apiKey : window.FIREBASE_CONFIG_API_KEY,
      authDomain : window.FIREBASE_CONFIG_AUTH_DOMAIN,
      databaseURL : window.FIREBASE_CONFIG_DATABASE_URL,
      projectId : window.FIREBASE_CONFIG_PROJECT_ID,
      storageBucket : window.FIREBASE_CONFIG_STORAGE_BUCKET,
      messagingSenderId : window.FIREBASE_CONFIG_MESSAGING_SENDER_ID
    };
    firebase.initializeApp(firebaseConfig);
  }
}
