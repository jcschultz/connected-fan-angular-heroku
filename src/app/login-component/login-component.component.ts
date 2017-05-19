import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector : 'app-login-component',
  templateUrl : './login-component.component.html',
  styleUrls : ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {}
  
  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signinUser(email, password);
  }
  
}
