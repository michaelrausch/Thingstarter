import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { LoginResponse, UserDetailResponse, SignupResponse } from "app/services/responses/user/UserResponses";
import { environment } from "environments/environment";
import { UserRegistration } from "app/models/forms/UserRegistration";
import { Router } from "@angular/router";

/**
 * Keep track of currently logged in user
 */
@Injectable()
export class LoginService {
    isUserLoggedIn = false;
    userId: number = 0;
    token: string = "";
    userData: UserDetailResponse;
    loginFlashMessage: string;
    postLoginRedirect: string;
    postLoginRedirectValid: boolean;

    constructor(public http: HttpClient, public router: Router) {
        let token = localStorage.getItem("loginToken");
        let userId = localStorage.getItem("userId");

        if (token){
            this.isUserLoggedIn = true;
            this.token = token;
            this.loadUserData(token, userId);
        }
    }

    /**
     * Return whether or not a user is logged in
     */
    isLoggedIn(){
        return this.isUserLoggedIn;
    }

    /**
     * Log a user in
     * @param username 
     * @param password 
     */
    login(username: string, password: string, isEmail: boolean = false){
        return Observable.create(observer => {
            this.doLoginRequest(username, password, isEmail)
                .subscribe(data => {
                    this.handleLoginSuccess(data);
                    observer.next();

                    //if (shouldRedirect) this.doPostLoginRedirect();
                    //this.clearPostLoginRedirect();
                },
                err => {
                    observer.error(err);
                });
        });
    }

    /**
     * Perform a POST request to log the user in to the service
     * @param username 
     * @param password 
     */
     doLoginRequest(username: string, password: string, isEmail: boolean = false){
        var params: HttpParams;

        if (isEmail){
            params = new HttpParams().set("email", username);
        }
        else{
            params = new HttpParams().set("username", username);
        }

        params = params.append("password", password)

        let apiUrl = environment.api_base_url + "users/login/";
        return this.http.post<LoginResponse>(apiUrl, {}, {
            params: params
        });
    }
 
    /**
     * Call when the login was successful.
     * This will store the token & user ID, and will
     * load and save the users information from the server
     * 
     * @param data The response from the server
     */
     handleLoginSuccess(data){
        this.token = data.token;
        this.isUserLoggedIn = true;
        this.userId = data.id;

        localStorage.setItem("loginToken", this.token);
        localStorage.setItem("userId", this.userId.toString());
        this.loadUserData(this.token, this.userId.toString());
    }

    /**
     * Load the currently logged in users 
     * @param token the users login token
     */
     loadUserData(token: string, userId: string){
        this.http.get<UserDetailResponse>(environment.api_base_url + "users/" + userId,  { headers: this.getAuthHeaders() })
            .subscribe(data => {
                this.userData = data;
                this.userId = data.id;
            },
            err => {
                this.removeSession();
            })
    }

    /**
     * Return HttpHeaders object containing the 
     * authorization header with the users token
     */
    getAuthHeaders(){
        return new HttpHeaders().append('X-Authorization', this.token);
    }

    /**
     * Perform a signup request to the server
     * @param signupData The registration information
     */
     doSignupRequest(signupData: UserRegistration){
        return this.http.post<SignupResponse>(environment.api_base_url + "users/", signupData.asJson())
    }

    /**
     * Register a user
     * @param userRegistration The users registration details
     */
    doSignup(userRegistration: UserRegistration){
        return Observable.create(observer => {
            this.doSignupRequest(userRegistration)
                .subscribe(data => {
                    observer.next();
                },
                error => {
                    observer.error(error);
                })
        });
    }

    /**
     * Removes the users session data
     */
     removeSession(){
        this.isUserLoggedIn = false;
        this.token = "";
        this.userId = 0;
        localStorage.clear();
    }

    /**
     * Perform a logout request for the currently logged in user
     */
     doLogoutRequest(){
        this.http.post(environment.api_base_url + "users/logout", {}, { headers: this.getAuthHeaders() })
            .subscribe(data => {
                this.removeSession();
            },
            err => {
                this.removeSession();
            });
    }

    /**
     * Log the user out
     */
    logout(){
        this.doLogoutRequest();
        this.removeSession();
    }

    /**
     * Redirect to the route stored in postLoginRedirect if it is set
     */
     doPostLoginRedirect(){
        if (this.isLoggedIn() && this.postLoginRedirect && this.postLoginRedirectValid){
            this.router.navigate([this.postLoginRedirect]);
            this.clearPostLoginRedirect();
        }
    }

    getPostLoginRedirect(){
        return this.postLoginRedirect;
    }

    /**
     * Set the page to redirect to after a successful login
     * @param route The route to redirect to
     */
    setPostLoginRedirect(route: string){
        this.postLoginRedirect = route;
    }

    /**
     * Remove the post login redirect
     */
    clearPostLoginRedirect(){
        this.postLoginRedirect = undefined;
    }

    /**
     * Redirect to the login page
     */
    redirectToLogin(){
        this.router.navigate(['./login']);
    }

    /**
     * Set the message to appear when the user is redirected
     * to the login
     * @param message the login message
     */
    setLoginFlash(message: string){
        this.loginFlashMessage = message;
    }

    getLoginFlashMessage(){
        var message = this.loginFlashMessage;
        this.loginFlashMessage = "";

        return message;
    }

    hasLoginFlashMessage(){
        return this.loginFlashMessage && this.loginFlashMessage != ""
    }
}
