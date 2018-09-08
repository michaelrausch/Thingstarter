import { Component, OnInit } from '@angular/core';
import { ProjectService } from "app/services/project.service";

@Component({
  selector: 'app-featured-list',
  templateUrl: './featured_list.component.html',
  styleUrls: ['./featured_list.component.css']
})
export class FeaturedListComponent implements OnInit {

  constructor(public projectService: ProjectService) { }

  ngOnInit() {
  }

  thereAreProjectsAvailable(){
    return this.projectService.getFeaturedProjects().length == 0;
  }

}
