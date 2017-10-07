import { Injectable } from '@angular/core';
import { ProjectBrief } from "app/services/responses/ProjectBrief";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";

@Injectable()
export class ProjectService {
    private projectBriefs: ProjectBrief[];
    private featuredProjects: ProjectBrief[];

    private isLoadingProjects: boolean = false;
    private currentIndex: number = 0;
    private chunkSize: number = 3;
    private startAmount: number = 6;
    private reachedEnd: boolean = false;

    constructor(private http: HttpClient) { 
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
            this.currentIndex += data.length;

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
        this.currentIndex = this.projectBriefs.length;
    }

    /**
     * return whether or not the end of the projects has been reached
     */
    public endOfProjectsReached(){
        return this.reachedEnd;
    }
}
