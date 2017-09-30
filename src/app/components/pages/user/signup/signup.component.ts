import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserRegistration } from '../../../../models/forms/UserRegistration';
import { environment } from '../../../../../environments/environment';
import { LoginService } from '../../../../services/login.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LoginResponse } from "app/services/responses/UserResponses";

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
    }

    signupError(errorCode: number){
        switch(errorCode){
            case 400:
            this.errorMessage = "Could not register your user, this user may already exist";
        }

        this.hasError = true;
    }

}

interface SignupResponse {
    login: string;
    bio: string;
    company: string;
}