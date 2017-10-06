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
    hasError: boolean = false
    model: UserRegistration = new UserRegistration("", "", "", "");
    wasSuccess: boolean = false;
    isSigningUp: boolean = false;

    constructor(private router: Router, private loginService: LoginService, private flashMessagesService: FlashMessagesService) { }

    ngOnInit() {
    }

    onSubmit() { 
        this.isSigningUp = true;

        this.loginService.doSignup(this.model).subscribe(success => {
            this.handleSignupSuccess();
        },
        error => {
            this.isSigningUp = false;
            this.handleSignupError(error.status);
        });
    }

    /**
     * The user was successfully signed up
     */
    handleSignupSuccess(){
        this.wasSuccess = true; // Display signup success box

        this.loginService.login(this.model.username, this.model.password)
            .subscribe(data => {
                this.isSigningUp = false;                
                this.router.navigate(['./']);
            },
            error => {
                this.isSigningUp = false;                
                this.router.navigate(['./login']);
            })
    }

    /**
     * There was an error signing the user up
     * @param errorCode 
     */
    handleSignupError(errorCode: number){
        switch(errorCode){
            case 400: // Bad request
                this.errorMessage = "Could not register your user, this user may already exist";
                break;

            default:
                this.errorMessage = "Error creating user";
        }

        this.hasError = true;
    }

}

