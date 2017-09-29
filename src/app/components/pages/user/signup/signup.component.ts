import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserRegistration } from '../../../../models/forms/UserRegistration';
import { environment } from '../../../../../environments/environment';
import { LoginService } from '../../../../services/login.service';
import { LoginResponse } from '../login/login.component';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
selector: 'app-signup-page',
templateUrl: './signup.component.html',
styleUrls: ['./signup.component.css']
})
export class SignupPageComponent implements OnInit {
    errorMessage: string = "";
    hasError: boolean = false;
    model: UserRegistration = new UserRegistration("", "", "", "");

    constructor(private http: HttpClient, private router: Router, private loginService: LoginService, private flashMessagesService: FlashMessagesService) { }

    ngOnInit() {
    }


    doSignupRequest(){
        this.http.post<SignupResponse>(environment.api_base_url + "users", this.model.asJson()).subscribe(data => {
            this.signupSuccess();
        },
        err => {
            this.signupError(err.status);
        });
    }

    onSubmit() { 
        this.doSignupRequest();
    }

    signupSuccess(){
        this.flashMessagesService.show("You have been registered, Logging in...", { cssClass: 'alert-success signup-error'});
        this.doLogin();
    }

    signupError(errorCode: number){
        switch(errorCode){
            case 400:
            this.errorMessage = "Could not register your user, this user may already exist";
        }

        this.hasError = true;
    }

    doLogin(){
        this.http.post<LoginResponse>(environment.api_base_url + "users/login?username=" + this.model.username + "&password=" + this.model.password, {}).subscribe(data => {
            this.loginService.login(data.id, data.token);
            this.router.navigate(['./']);
        },
        error => {
            this.router.navigate(['./login']);
        });
    }
}

interface SignupResponse {
    login: string;
    bio: string;
    company: string;
}