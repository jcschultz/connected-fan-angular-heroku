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
    this.fanControlService.callAction(control, speed, this.token)
      .then(() => {
        console.log('successfully called fan action');
      })
      .catch((err) => {
        console.log('error calling fan action', err);
      });
  }

}
