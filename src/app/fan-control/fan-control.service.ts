import { Injectable } from '@angular/core';
import * as request from 'request-promise-native';

let _window: any = window;

@Injectable()
export class FanControlService {

  constructor() { }
  
  callAction(control: string, action: string, token: string) {
    let url: string = _window.location.protocol + '//' + _window.location.hostname + '/api/' + control;
    
    if (control === 'fan') {
      url += '/' + action;
    }
    
    let options = {
      method: 'PUT',
      url: url,
      json: {'token' : token}
    };
    
    return request(options);
  }
  
}
