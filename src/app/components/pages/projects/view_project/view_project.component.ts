import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'app/services/project.service';
import { Project } from 'app/services/responses/projects/Project';
import { LoginService } from "app/services/login.service";

@Component({
  selector: 'app-view-project-page',
  templateUrl: './view_project.component.html',
  styleUrls: ['./view_project.component.css']
})
export class ViewProjectPageComponent implements OnInit {
  project: Project;
  userId: number;
  projectId: number;
  creationDateString: string = "";  

  constructor(public route: ActivatedRoute, public projectService: ProjectService, public loginService: LoginService, public router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });

    this.userId = this.loginService.userId;
    this.loadProject(this.projectId);
  }

  loadProject(id: number){
    this.projectService.getProject(id)
      .subscribe(project => {
        this.project = project as Project;
        this.creationDateString = this.formatCreationDate(this.project.creationDate);
      }, error => {       
        this.router.navigate(['./explore']);
      });
  }

  formatCreationDate(creationDate: number){
    var date = new Date(creationDate);
    var month = "";

    switch(date.getMonth()){
      case 0: month = "January"; break;
      case 1: month = "February"; break;
      case 2: month = "March"; break;
      case 3: month = "April"; break;
      case 4: month = "May"; break;
      case 5: month = "June"; break;
      case 6: month = "July"; break;
      case 7: month = "August"; break;
      case 8: month = "September"; break;
      case 9: month = "October"; break;
      case 10: month = "November"; break;
      case 11: month = "December"; break;
    }
    return "" + date.getDate() + " " +  month + " " + date.getFullYear();
  }

  isOwner(){    
    for (let creator of this.project.creators){
      if (creator.id == this.loginService.userId) return true;
    }

    return false;
  }

  eligibleToPledge(){
    if (!this.project.open) return false;
    
    if (this.isOwner()) return false;

    return true;
  }

  pledgeClicked(amount: number){
    if (!this.eligibleToPledge()) return;

    this.projectService.setPledgeAmount(amount);
    this.projectService.startPledgeToProject(this.project.id);
  }

  closeProject(){
    this.project.open = false;
    this.projectService.closeProject(this.projectId).subscribe();
    window.scrollTo(0, 0);
  }

  customPledgeClicked(){
    localStorage.setItem('pledgeAmount', undefined);
    this.router.navigate(['/project/' + this.projectId + '/pledge']);
  }
}
