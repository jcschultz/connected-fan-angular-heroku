import { Injectable } from '@angular/core';
import * as request from 'request';

let _window: any = window;

@Injectable()
export class FanControlService {

  constructor() { }
  
  callAction(control: string, action: string, token: string) {
    let url: string = _window.location.protocol + '//' + _window.location.hostname + '/api/' + control;
    
    if (control === 'fan') {
      url += '/' + action;
    }
    
    return new Promise((resolve, reject) => {
      request({
        method: 'PUT',
        url: url,
        body: {'token' : token},
        json: true
      }, (error, response, body) => {
        if (error) {
          console.info(error);
          reject(error);
        }
        else {
          console.info(response);
          console.info(body);
          resolve();
        }
      });
    });
  }
  
}
