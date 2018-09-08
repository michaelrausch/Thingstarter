import { Component, OnInit } from '@angular/core';
import { ProjectCreationFormService, FormLocation, BasicProjectInfo } from "app/services/project-creation-form.service";

@Component({
  selector: 'app-create-project-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent implements OnInit {
  model: BasicProjectInfo = new BasicProjectInfo();

  constructor(public projectCreationFormService: ProjectCreationFormService) { }

  ngOnInit() {
  }

  onSubmit(){
    this.projectCreationFormService.setFormLocation(FormLocation.REWARDS);

    this.model.target = this.model.target * 100;

    this.projectCreationFormService.addBasicProjectInfo(this.model);
  }
}
