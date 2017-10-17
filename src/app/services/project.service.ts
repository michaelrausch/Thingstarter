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
import { Backer } from 'app/services/responses/projects/Backer';


@Injectable()
export class ProjectService {
    private projectBriefs: ProjectBrief[];
    private featuredProjects: ProjectBrief[];

    private isLoadingProjects: boolean = false;
    private currentIndex: number = 0;
    private chunkSize: number = 6;
    private startAmount: number = 6;
    private reachedEnd: boolean = false;

    private onlyLoadOpenProjects: boolean = true;
    private creatorFilter: string;
    private backerFilter: string;
    private filterByBacker: boolean = false;
    private filterByCreator: boolean = false;
    private searchFilter: string = ""

    constructor(private http: HttpClient, private router: Router, private loginService: LoginService) { 
        this.loadFeaturedProjects();
        this.projectBriefs = new Array();
    }

    /**
     * Loads a list of initial projects
     */
    private loadFeaturedProjects(){
        this.http.get<ProjectBrief[]>(environment.api_base_url + "projects", { 
                params: new HttpParams().set("startIndex", "0").append("count", this.startAmount.toString()).append("open", "true")
            })
            .subscribe(data => {
                this.featuredProjects = this.processProjectsResponse(data, false);
            }, error => {
                //TODO handle error
                console.log(error);
            });
    }

    /**
     * Appends the correct image path to the imageUri
     * @param projects The list of projects to process
     */
    private processProjectsResponse(projects: ProjectBrief[], applySearchFilter: boolean){
        for(let project of projects){
            project.imageUri = environment.api_base_url + project.imageUri;
        }

        return projects;
    }

    private processProjectResponse(project: Project){
        var anonPledgeAmount = 0;
        var pledges: Backer[] = new Array();

        // TODO remove magic number
        project.backers = project.backers.slice(0, 5);

        for (let pledge of project.backers){
            if (pledge.username.toLowerCase() == 'anonymous'){
                anonPledgeAmount += pledge.amount;
            }
            else{
                pledges.push(pledge);
            }
        }

        if (anonPledgeAmount > 0){
            pledges.push({
                id: 0,
                username: "Anonymous",
                amount: anonPledgeAmount
            } as Backer)
        }
        
        project.backers = pledges;

        return project;
    }

    /**
     * Get a list of featured projects
     */
    public getFeaturedProjects(){
        return this.featuredProjects ? this.featuredProjects : [];
    }

    /**
     * Get all the currently loaded project briefs
     */
    public getProjectBriefs(){
        if (this.projectBriefs == undefined || this.projectBriefs.length == 0){
            this.loadNextChunk();
        }
        return this.projectBriefs ? this.projectBriefs : [];
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
            params: this.buildParams()
        })
        .subscribe(data => {
            if (data.length == 0){
                this.reachedEnd = true;
                this.isLoadingProjects = false;
                return;
            }

            data = this.processProjectsResponse(data, true);

            if (this.projectBriefs != undefined){
                this.projectBriefs = this.projectBriefs.concat(data);
            }
            else{
                this.projectBriefs = data;
            }
        
            this.isLoadingProjects = false;
            this.currentIndex += this.chunkSize;
        }, error =>{
            console.log(error);
            this.isLoadingProjects = false;
        });
    }

    private buildParams() : HttpParams{
        var params = new HttpParams();

        params = params.set("startIndex", this.currentIndex.toString());
        params = params.append("count", this.chunkSize.toString());

        params = params.append("open", this.onlyLoadOpenProjects ? "true" : "false");

        if (this.filterByCreator) {
            params = params.append("creator", this.creatorFilter);
        }

        if (this.filterByBacker) {
            params = params.append("backer", this.backerFilter);
        }

        return params;
    }

    public setCreatorFilter(creatorId: string){
        this.creatorFilter = creatorId;
    }

    public setCreatorFilterEnabled(isEnabled: boolean){
        this.filterByCreator = isEnabled;        
    }

    public setBackerFilter(backerId: string){
        this.backerFilter = backerId;
    }

    public setBackerFilterEnabled(isEnabled: boolean){
        this.filterByBacker = isEnabled;
    }

    public setOnlyLoadOpenProjects(onlyLoadOpen: boolean){
        this.onlyLoadOpenProjects = onlyLoadOpen;
    }

    /**
     * Reset the list of project briefs back to its original state
     */
    public resetChunks(){
        this.projectBriefs = new Array();
        this.reachedEnd = false;
        this.currentIndex = 0;
        this.reachedEnd = false;
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
                    data = this.processProjectResponse(data);
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
        localStorage.setItem('PledgeAmount', undefined);
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
        return new Observable(observer => {
            if (file.type != "image/jpeg" && file.type !="image/png") return observer.error({
                error: "Invalid file format"
            });

            this.http.put(environment.api_base_url + "projects/" + id + "/image", file, {
                headers: this.loginService.getAuthHeaders().append("Content-Type", file.type)
            }).subscribe(data => {
                observer.next();
            }, error => {
                observer.next();
            })
        });
    }

    public closeProject(id: number){
        return new Observable(observer => {
            if (!this.loginService.isLoggedIn()) return observer.error({error: "Not logged in"});

            this.http.put(environment.api_base_url + "projects/" + id, { open: false}, { headers: this.loginService.getAuthHeaders(), responseType: "text" })
                .subscribe(data => {
                    return observer.next({});
                }, error => {
                    return observer.error({error: error.error});
                })
        });
    }
}

