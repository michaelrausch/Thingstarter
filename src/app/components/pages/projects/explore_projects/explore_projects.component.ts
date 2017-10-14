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
  private sq: string = "";
  private showLoadingAnimation: boolean = false;
  private timer;
  private timerSubscription;

  private showProjectsBacked = false;
  private showProjectsCreated = false;

  constructor(private projectService: ProjectService, private loginService: LoginService) { 

  }

  ngOnInit() {
    this.projectService.resetChunks();
    this.projectService.loadNextChunk();
    this.startLoadingAnimation();
  }

  scrolledDown () {
      this.startLoadingAnimation();
	    this.projectService.loadNextChunk();
	}

  searchChanged(){
    this.startLoadingAnimation();
  }

  startLoadingAnimation(){
    this.showLoadingAnimation = true;

    if (this.timerSubscription){
      this.timerSubscription.unsubscribe();
    }

    this.timer = Observable.timer(3000);
    
    this.timerSubscription = this.timer.subscribe(() => {
      this.hideLoadingAnimation();
    })
  }

  hideLoadingAnimation(){
    this.showLoadingAnimation = false;
  }

  toggleProjectsBacked(){
    this.showProjectsBacked = !this.showProjectsBacked;
    console.log(this.showProjectsBacked)
    
    this.projectService.setBackerFilterEnabled(this.showProjectsBacked);
    this.projectService.setBackerFilter(this.loginService.userId.toString())

    this.projectService.resetChunks();
    this.projectService.loadNextChunk();
    
    console.log("HI");
  }

  toggleProjectsCreated(){ 
    this.showProjectsCreated = !this.showProjectsCreated;
    console.log(this.showProjectsCreated)
  
    this.projectService.setCreatorFilterEnabled(this.showProjectsCreated);
    this.projectService.setCreatorFilter(this.loginService.userId.toString())

    this.projectService.resetChunks();
    this.projectService.loadNextChunk();
    console.log("HI");
  }
}
