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

  constructor(private router: Router, afAuth: AngularFireAuth) {
    console.log('in constructor of authservice');
    // this.auth = fbApp.auth();
    this.user = afAuth.authState;
    console.log('this.user', this.user);
  }
  
  signinUser(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then(
        response => {
          this.router.navigate(['/']);
          this.auth.currentUser.getIdToken()
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
    this.auth.currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  isAuthenticated() {
    return this.token != null;
  }

  logout() {
    this.auth.signOut();
    this.token = null;
  }

}
