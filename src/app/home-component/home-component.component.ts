import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { FanControlService } from '../fan-control/fan-control.service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {
  token: string;
  activeButton: string;
  actionPending = false;
  errorMsg: string;

  constructor(private authService: AuthService, private router: Router, private fanControlService: FanControlService) { }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    else {
      this.token = this.authService.getToken();
    }
  }
  
  onBtnClick(control: string, speed: string) {
    this.activateButton(control, speed);
    
    this.fanControlService.callAction(control, speed, this.token)
      .then((res) => {
        this.resetButtons();
        console.log('successfully called fan action');
      })
      .catch((err) => {
        this.resetButtons();
        console.error('error calling fan action', err);
        this.errorMsg = 'Oops! Something went wrong. Try again.'
      });
  }
  
  activateButton(control: string, speed: string) {
    this.actionPending = true;
    this.errorMsg = null;
    
    if (control === 'light') {
      this.activeButton = 'light';
    }
    else {
      this.activeButton = speed;
    }
  }
  
  resetButtons() {
    this.actionPending = false;
    this.activeButton = null;
  }

}
