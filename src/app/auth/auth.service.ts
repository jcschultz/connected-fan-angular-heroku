import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class AuthService {
  token: string;
  user: Observable<firebase.User>;
  
  constructor(private router: Router, public afAuth: AngularFireAuth) {
    console.log('in constructor of authservice');
    this.user = afAuth.authState;
    console.log('this.user', this.user);
  }
  
  initApp() {
    // AngularFireModule.initializeApp(firebaseConfig);
    //firebase.initializeApp(firebaseConfig);
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
