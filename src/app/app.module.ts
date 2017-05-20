import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { AppRouterModule } from './app-router/app-router.module';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { FanControlService } from './fan-control/fan-control.service';
import { firebaseConfig } from './auth/firebaseConfig';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponentComponent,
    LoginComponentComponent
  ],
  imports: [
    AngularFireModule.initializeApp({
      apiKey : firebaseConfig.apiKey,
      authDomain : firebaseConfig.authDomain,
      databaseURL : firebaseConfig.databaseURL,
      projectId : firebaseConfig.projectId,
      storageBucket : firebaseConfig.storageBucket,
      messagingSenderId : firebaseConfig.messagingSenderId
    }),
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouterModule
  ],
  providers: [
    AngularFireAuth,
    AuthGuardService,
    AuthService,
    FanControlService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
