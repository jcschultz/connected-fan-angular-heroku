import { Injectable } from '@angular/core';
import * as request from 'request';

@Injectable()
export class FanControlService {

  constructor() { }
  
  callAction(control: string, action: string, token: string) {
    let url: string = '/api/' + control;
    
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
          reject(error);
        }
        else {
          resolve({response: response, body: body});
        }
      });
    });
  }
  
}
