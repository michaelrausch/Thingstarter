import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'app/services/project.service';
import { Project } from 'app/services/responses/projects/Project';
import { LoginService } from "app/services/login.service";

@Component({
  selector: 'app-view-project-page',
  templateUrl: './view_project.component.html',
  styleUrls: ['./view_project.component.css']
})
export class ViewProjectPageComponent implements OnInit {
  private project: Project;
  private userId: number;

  constructor(private route: ActivatedRoute, private projectService: ProjectService, private loginService: LoginService ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadProject(params['id']);
    });

    this.userId = this.loginService.userId;
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

  private pledgeClicked(amount: number){
    console.log(amount);
    this.projectService.setPledgeAmount(amount);
    this.projectService.startPledgeToProject(this.project.id);
  }
}
