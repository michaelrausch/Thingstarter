import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private loggedInUserName: string;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  isLoggedIn(){
    return this.loginService.isLoggedIn()
  }

  doLogout(){
    this.loginService.logout();
  }

}
