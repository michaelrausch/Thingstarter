import { Component, OnInit } from '@angular/core';
import { ProjectService } from "app/services/project.service";
import { ProjectBrief } from "app/services/responses/ProjectBrief";

@Component({
  selector: 'app-explore-projects-page',
  templateUrl: './explore_projects.component.html',
  styleUrls: ['./explore_projects.component.css']
})
export class ExplorePageComponent implements OnInit {
  constructor(private projectService: ProjectService) { 

  }

  ngOnInit() {
    this.projectService.resetChunks();
  }

  scrolledDown () {
	    this.projectService.loadNextChunk();
	}

}
