import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  auth: firebase.auth.Auth;
  token: string;
  user: Observable<firebase.User>;

  constructor(private router: Router, public afAuth: AngularFireAuth) {
    // this.auth = fbApp.auth();
    this.user = afAuth.authState;
  }
  
  signinUser(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(
        response => {
          this.router.navigate(['/']);
          this.doTokenRetrieval();
        }
      )
      .catch(
        error => console.log(error)
      );
  }

  getToken() {
    this.doTokenRetrieval()
      .then(() => {
        return this.token;
      });
  }

  isAuthenticated() {
    return this.token != null;
  }

  logout() {
    this.afAuth.auth.signOut();
    this.token = null;
  }
  
  doTokenRetrieval() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.currentUser.getIdToken()
        .then(
          (token: string) => {
            this.token = token;
            resolve();
          }
        );
    });
  }
  

}
