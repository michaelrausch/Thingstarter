import { Injectable } from '@angular/core';
import { ProjectService } from "app/services/project.service";
import { LoginService } from "app/services/login.service";

@Injectable()
export class ProjectCreationFormService {
    formLocation: FormLocation;

    basicProjectInfo: BasicProjectInfo;
    rewards: Reward[];
    projectId: number;
    errorCreatingProject: boolean = false;

    constructor(public projectService: ProjectService, public loginService: LoginService) { }

    public reset(){
        this.formLocation = FormLocation.BASIC_INFO;
    }

    public getFormLocation(){
        return this.formLocation;
    }

    public setFormLocation(location: FormLocation){
        this.formLocation = location;
    }

    public addBasicProjectInfo(model: BasicProjectInfo){
        this.basicProjectInfo = model;
    }

    public addRewards(rewards: Reward[]){
        this.rewards = rewards;;
    }

    public addProject(){
        return this.projectService.addProject(this.basicProjectInfo, this.rewards, this.loginService.userId)
    }

    public setProjectId(id: number){
        this.projectId = id;
    }

    public getProjectId(){
        return this.projectId;
    }

    public hadErrorCreatingProject(){
        return this.errorCreatingProject;
    }
}

export enum FormLocation {
    BASIC_INFO, REWARDS, UPLOAD_IMAGE, DONE
}

export class BasicProjectInfo{
    public title: string;
    public subtitle: string;
    public description: string;
    public target: number;
}

export class Reward{
    public amount: number;
    public description: string;
}