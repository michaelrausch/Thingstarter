import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'app/services/project.service';
import { Project } from 'app/services/responses/projects/Project';

@Component({
  selector: 'app-view-project-page',
  templateUrl: './view_project.component.html',
  styleUrls: ['./view_project.component.css']
})
export class ViewProjectPageComponent implements OnInit {
  private project: Project;

  constructor(private route: ActivatedRoute, private projectService: ProjectService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadProject(params['id']);
    });

  }

  private loadProject(id: number){
    this.projectService.getProject(id)
      .subscribe(project => {
        this.project = project as Project;
        console.log(project);
      }, error => {
        alert(error);
      });
  }

  private pledgeClicked(){
    this.projectService.startPledgeToProject(this.project.id);
  }

}
