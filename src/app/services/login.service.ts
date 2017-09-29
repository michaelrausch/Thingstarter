import { Injectable } from '@angular/core';

/**
 * Keep track of currently logged in user
 */
@Injectable()
export class LoginService {
  isUserLoggedIn = false;
  userId: number = 0;
  token: string = "";

  constructor() {
  }

  isLoggedIn(){
    return this.isUserLoggedIn;
  }

  login(userId: number, token: string){
    this.userId = userId;
    this.isUserLoggedIn = true;
    this.token = token;
  }
}
