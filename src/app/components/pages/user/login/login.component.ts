import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserLogin } from '../../../../models/forms/UserLogin';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginPageComponent implements OnInit {
  hadError: boolean = false;
  errorMessage: string = "";

  model: UserLogin = new UserLogin("","");

  constructor(private loginService: LoginService, 
              private http: HttpClient, 
              private router: Router,
              ) { }

  ngOnInit() {

  }

  onSubmit(){
    this.http.post<LoginResponse>("http://db.sydney.michaelrausch.nz:4941/api/v2/users/login?username=" + this.model.username + "&password=" + this.model.password, {}).subscribe(data => {
      this.loginService.login(data.id, data.token);
      this.router.navigate(['./']);
    },
    error => {
      this.handleError(error.status);
    });
  }

  handleError(code: number){
    switch(code){
      case 400:
        this.errorMessage = "Bad username / password combo";
    }

    this.hadError = true;
  }
}

export interface LoginResponse {
  id: number;
  token: string;
}