import { Injectable } from '@angular/core';
import * as request from 'request-promise-native';

let _window: any = window;

@Injectable()
export class FanControlService {

  constructor() { }
  
  callAction(control: string, action: string, token: string) {
    let hostName = _window.location.hostname;
    
    if (hostName === 'localhost') {
      hostName += ':3000';
    }
    
    let url: string = _window.location.protocol + '//' + hostName + '/api/' + control;
    
    if (control === 'fan') {
      url += '/' + action;
    }
    
    let options = {
      method: 'PUT',
      url: url,
      body: {'token' : token},
      json: true
    };
    
    return request(options);
  }
  
}
