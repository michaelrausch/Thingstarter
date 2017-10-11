import { Component, OnInit } from '@angular/core';
import { ProjectCreationFormService, FormLocation, BasicProjectInfo } from "app/services/project-creation-form.service";

@Component({
  selector: 'app-create-project-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {
  private model: BasicProjectInfo = new BasicProjectInfo();

  constructor(private projectCreationFormService: ProjectCreationFormService) { }

  ngOnInit() {
  }

  onSubmit(){
    this.projectCreationFormService.setFormLocation(FormLocation.REWARDS);
    this.projectCreationFormService.addBasicProjectInfo(this.model);
  }
}
