import { Component, OnInit } from '@angular/core';
import { ProjectService } from "app/services/project.service";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import { LoginService } from 'app/services/login.service';

@Component({
  selector: 'app-explore-projects-page',
  templateUrl: './explore_projects.component.html',
  styleUrls: ['./explore_projects.component.css']
})
export class ExplorePageComponent implements OnInit {
  private searchQuery: string = "";
  private showLoadingAnimation: boolean = false;
  private timer;
  private timerSubscription;

  private showProjectsBacked = false;
  private showProjectsCreated = false;

  private isInSearchMode: boolean = false;

  constructor(private projectService: ProjectService, private loginService: LoginService) { 

  }

  ngOnInit() {
    this.projectService.setBackerFilterEnabled(false);
    this.projectService.setCreatorFilterEnabled(false);
    
    this.projectService.resetChunks();
    this.projectService.loadNextChunk();
  }

  scrolledDown () {
	    this.projectService.loadNextChunk();
	}

  searchChanged(){  
    if (this.searchQuery == ""){
      this.isInSearchMode = false;
    }
    else{
      this.isInSearchMode = true;
    }
  }

  hideLoadingAnimation(){
    this.showLoadingAnimation = false;
  }

  filterAllProjects(){
    this.showProjectsBacked = false;
    this.showProjectsCreated = false;
    //this.projectService.setOnlyLoadOpenProjects(true);
    
    this.reloadProjects();
  }

  filterBackedProjects(){
    this.showProjectsBacked = true;
    this.showProjectsCreated = false;
    //this.projectService.setOnlyLoadOpenProjects(false);
    

    this.reloadProjects();
  }

  filterCreatedProjects(){ 
    this.showProjectsBacked = false;
    this.showProjectsCreated = true;
    //this.projectService.setOnlyLoadOpenProjects(false);

    this.reloadProjects();
  }

  reloadProjects(){
    this.projectService.setCreatorFilterEnabled(this.showProjectsCreated);
    this.projectService.setCreatorFilter(this.loginService.userId.toString());

    this.projectService.setBackerFilterEnabled(this.showProjectsBacked);
    this.projectService.setBackerFilter(this.loginService.userId.toString());


    this.projectService.resetChunks();
    this.projectService.loadNextChunk();
  }

  getFilterButtonLabel(){
    if (this.showProjectsBacked) return "Filter (Backed Projects)";
    if (this.showProjectsCreated) return "Filter (Created Projects)";
    return "Filter (All Projects)"
  }

  thereAreProjectsAvailable(){
    return this.projectService.getProjectBriefs().length != 0;
  }
}
