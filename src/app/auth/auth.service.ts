import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

let _window :any = window;

let firebaseConfig = {
  apiKey : _window.FIREBASE_CONFIG_API_KEY,
  authDomain : _window.FIREBASE_CONFIG_AUTH_DOMAIN,
  databaseURL : _window.FIREBASE_CONFIG_DATABASE_URL,
  projectId : _window.FIREBASE_CONFIG_PROJECT_ID,
  storageBucket : _window.FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId : _window.FIREBASE_CONFIG_MESSAGING_SENDER_ID
};

@Injectable()
export class AuthService {
  token: string;
  user: Observable<firebase.User>;
  
  constructor(private router: Router, public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
    console.log('this.user', this.user);
  }
  
  initApp() {
    AngularFireModule.initializeApp(firebaseConfig);
  }
  
  signinUser(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(
        response => {
          this.router.navigate(['/']);
          firebase.auth().currentUser.getIdToken()
            .then(
              (token: string) => this.token = token
            );
        }
      )
      .catch(
        error => console.log(error)
      );
  }
  
  getToken() {
    firebase.auth().currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }
  
  isAuthenticated() {
    return this.token != null;
  }
  
  logout() {
    this.afAuth.auth.signOut();
    this.token = null;
  }
  
}
