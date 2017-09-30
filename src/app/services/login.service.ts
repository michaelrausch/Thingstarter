import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { LoginResponse, UserDetailResponse } from "app/services/responses/UserResponses";
import { environment } from "environments/environment";

/**
 * Keep track of currently logged in user
 */
@Injectable()
export class LoginService {
    isUserLoggedIn = false;
    userId: number = 0;
    token: string = "";
    userData: UserDetailResponse;

    constructor(private http: HttpClient) {
        
    }

    isLoggedIn(){
        return this.isUserLoggedIn;
    }

    login(username: string, password: string){

        return Observable.create(observer => {
            this.doLoginRequest(username, password)
                .subscribe(data => {
                    this.handleLoginSuccess(data);

                    observer.next();
                    this.loadUserData();
                },
                err => {
                    observer.error(err);
                });
        });
    }

    doLoginRequest(username: string, password: string){
        let apiUrl = environment.api_base_url + "users/login/";
        return this.http.post<LoginResponse>(apiUrl, {}, {
            params: new HttpParams().set("username", username).append("password", password)
        });
    }

    buildQueryString(username: string, password: string){
        return "?username=" + username + "&password=" + password;
    }
 
    handleLoginSuccess(data){
        this.token = data.token;
        this.isUserLoggedIn = true;
        this.userId = data.id;
    }

    loadUserData(){
        this.http.get<UserDetailResponse>(environment.api_base_url + "users/" + this.userId.toString(),  { headers: this.getHeaders() })
            .subscribe(data => {
                this.userData = data;
                console.log(data);
            },
            err => {
                console.log(err);
            })
    }

    getHeaders(){
        return new HttpHeaders().append('X-Authorization', this.token);
    }
}
