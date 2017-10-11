import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { Observable } from 'rxjs/Observable';
import { Project } from 'app/services/responses/projects/Project';
import { ProjectBrief } from 'app/services/responses/projects/ProjectBrief';
import { Router } from "@angular/router";
import { LoginService } from "app/services/login.service";
import { HttpHeaders } from "@angular/common/http";
import { BasicProjectInfo, Reward } from "app/services/project-creation-form.service";
import { ProjectCreationResponse } from "app/services/responses/projects/ProjectCreationResponse";

@Injectable()
export class ProjectService {
    private projectBriefs: ProjectBrief[];
    private featuredProjects: ProjectBrief[];

    private isLoadingProjects: boolean = false;
    private currentIndex: number = 0;
    private chunkSize: number = 3;
    private startAmount: number = 6;
    private reachedEnd: boolean = false;

    constructor(private http: HttpClient, private router: Router, private loginService: LoginService) { 
        this.loadInitialProjects();
    }

    /**
     * Loads a list of initial projects
     */
    private loadInitialProjects(){
        this.http.get<ProjectBrief[]>(environment.api_base_url + "projects", { params: new HttpParams().set("startIndex", "0").append("count", this.startAmount.toString())})
            .subscribe(data => {
                this.projectBriefs = this.processProjectResponse(data);
                this.featuredProjects = this.projectBriefs;
                this.currentIndex = data.length;
            }, error => {
                console.log(error);
            });
    }

    /**
     * Appends the correct image path to the imageUri
     * @param projects The list of projects to process
     */
    private processProjectResponse(projects: ProjectBrief[]){
        for(let project of projects){
            project.imageUri = environment.api_base_url + project.imageUri;
        }

        return projects;
    }

    /**
     * Get a list of featured projects
     */
    public getFeaturedProjects(){
        return this.featuredProjects;
    }

    /**
     * Get all the currently loaded project briefs
     */
    public getProjectBriefs(){
        return this.projectBriefs;
    }

    /**
     * Load the next chunk of project briefs
     * 
     * This will append *chunkSize* projects to the list, *reachedEnd* will be set
     * if there are no more projects to display
     */
    public loadNextChunk(){
        if (this.isLoadingProjects) return;
        if (this.reachedEnd) return;

        this.isLoadingProjects = true;

        this.http.get<ProjectBrief[]>(environment.api_base_url + "/projects", { 
            params: new HttpParams().set("startIndex", this.currentIndex.toString()).append("count", this.chunkSize.toString())
        })
        .subscribe(data => {
            data = this.processProjectResponse(data);
            this.projectBriefs = this.projectBriefs.concat(data);


            this.isLoadingProjects = false;
            this.currentIndex = data.length;

            if (data.length == 0){
                this.reachedEnd = true;
            }
        }, error =>{
            console.log(error);
            this.isLoadingProjects = false;
        });
    }

    /**
     * Reset the list of project briefs back to its original state
     */
    public resetChunks(){
        this.projectBriefs = this.featuredProjects;
        this.reachedEnd = false;

        if (this.projectBriefs == undefined){
            this.loadInitialProjects();
        }
        else{
            this.currentIndex = this.projectBriefs.length;
        }
    }

    /**
     * return whether or not the end of the projects has been reached
     */
    public endOfProjectsReached(){
        return this.reachedEnd;
    }

    public getProject(id: number){
        return new Observable(observer => {
            this.http.get<Project>(environment.api_base_url + "projects/" + id)
                .subscribe(data => {
                    data.imageUri = environment.api_base_url + data.imageUri;
                    
                    observer.next(data);
                },
                error =>{
                    observer.next(error.error);
                })
        });
    }

    public startPledgeToProject(id: number){
        this.router.navigate(['./project/' + id + '/pledge']);
    }

    public pledge(id: number, userId: number, amount: number, isAnon: boolean, token: string){
        return new Observable(observer => {
            if (!localStorage.getItem("loginToken")) return observer.error({
                error: "Not logged in",
                status: 401
            });
            this.http.post(environment.api_base_url + "projects/" + id + "/pledge", {
                id: userId,
                amount: amount,
                anonymous: isAnon,
                card: {
                    authToken: token.toString()
                }
            },
            {
                headers: new HttpHeaders().append('X-Authorization', localStorage.getItem('loginToken'))
            })
            .subscribe(data => {
                observer.next();
            },
            error => {
                console.log(error);
                observer.error({
                    error: error.error,
                    status: error.status
                })
            })
        });
    }

    public setPledgeAmount(pledgeAmount: number){
        localStorage.setItem("pledgeAmount", pledgeAmount.toString());
    }

    public getPledgeAmount(){
        var pledgeAmount = localStorage.getItem("pledgeAmount");
        return +pledgeAmount;
    }

    public addProject(projectInfo: BasicProjectInfo, rewards: Reward[], userId: number){
        for (let reward of rewards){
            reward.amount = +reward.amount;
        }

        return new Observable(observer => {
            if (!this.loginService.isLoggedIn()) return observer.error({
                error: "Not logged in",
                status: 401
            });

            console.log({
                title: projectInfo.title,
                subtitle: projectInfo.subtitle,
                description: projectInfo.description,
                target: +projectInfo.target,
                creators: new Array({
                    id: +userId
                }, {id:1}),
                rewards: rewards
            })

            this.http.post<ProjectCreationResponse>(environment.api_base_url + "projects", {
                title: projectInfo.title,
                subtitle: projectInfo.subtitle,
                description: projectInfo.description,
                target: +projectInfo.target,
                creators: [{
                    id: +userId
                }],
                rewards: rewards
            }, {
                headers: this.loginService.getAuthHeaders()
            }).subscribe(result => {
                return observer.next(result.id);
            }, error => {
                return observer.error({
                    status: error.status,
                    error: error.error
                })
            })
        });
    }

    public uploadImageForProject(id: number, userId: number, file: File){
        this.http.put(environment.api_base_url + "projects/" + id + "/image", file, {
            headers: this.loginService.getAuthHeaders().append("Content-Type", "image/png")
        }).subscribe(data => {
            console.log(data);
        }, error => {
            console.log(error);
        })
    }
}

