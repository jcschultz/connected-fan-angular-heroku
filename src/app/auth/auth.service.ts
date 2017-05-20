import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { FirebaseApp } from './firebase';

@Injectable()
export class AuthService {
  auth: firebase.auth.Auth;
  token: string;
  user: Observable<firebase.User>;

  constructor(private router: Router, fbApp: FirebaseApp) {
    console.log('in constructor of authservice');
    this.auth = fbApp.auth();
    this.user = this.getObservableUser(fbApp);
    console.log('this.user', this.user);
  }
  
  getObservableUser(fbApp: FirebaseApp): Observable<firebase.User> {
    const user = Observable.create((obs: Observer<firebase.User>) => {
      this.auth.onAuthStateChanged(
        (user? : firebase.User) => {
          obs.next(user)
        },
        (err: firebase.auth.Error) => {
          obs.error(err)
        },
        () => {
          obs.complete();
        }
      )
    });
    
    return user;
  }

  signinUser(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
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
