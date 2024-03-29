import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../services/login.service';
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
  isLoggingIn: boolean = false;
  loginRedirect: string;
  hasFlashMessage: boolean = false;
  flashMessage: string = "";

  model: UserLogin = new UserLogin("","");

  constructor(public loginService: LoginService, 
    public router: Router,
              ) { }

  ngOnInit() {
    if(this.loginService.isLoggedIn()){
      this.router.navigate(['./']);
    }

    this.loginRedirect = this.loginService.getPostLoginRedirect();
    this.loginService.clearPostLoginRedirect();

    this.hasFlashMessage = this.loginService.hasLoginFlashMessage();
    this.flashMessage = this.loginService.getLoginFlashMessage();
  }

  onSubmit(){
    this.isLoggingIn = true;

    var isEmail: boolean = this.model.username.indexOf('@') > 0;

    this.loginService.login(this.model.username, this.model.password, isEmail)
        .subscribe(success => {
            this.isLoggingIn = false;          
            
            if (this.loginRedirect){
              this.router.navigate([this.loginRedirect]);
              this.loginService.clearPostLoginRedirect();              
            }
            else{
              this.router.navigate(['./']);
            }
        },
        error => {
            this.isLoggingIn = false;
            this.handleError(error.status, error.error);
        })
  }

  handleError(code: number, message: string){
    switch(code){
      case 400:
        this.errorMessage = message;
        break;
      default:
        this.errorMessage = "Error logging you in, please try again later";
    }

    this.hadError = true;
  }
}
