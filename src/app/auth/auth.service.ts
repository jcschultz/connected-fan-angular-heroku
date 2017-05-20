import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { firebaseConfig } from './firebaseConfig';

@Injectable()
export class AuthService {
  token: string;
  user: Observable<firebase.User>;
  
  constructor(private router: Router) {
    firebase.initializeApp(firebaseConfig);
    console.log('in constructor of authservice');
    //this.user = afAuth.authState;
    //console.log('this.user', this.user);
  }
  
  initApp() {
    // AngularFireModule.initializeApp(firebaseConfig);
  }
  
  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
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
    firebase.auth().signOut();
    this.token = null;
  }
  
}
