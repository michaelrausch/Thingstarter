import { Component, OnInit } from '@angular/core';
import { Reward, FormLocation, ProjectCreationFormService } from "app/services/project-creation-form.service";

@Component({
  selector: 'app-create-project-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})
export class RewardsComponent implements OnInit {
  private currentReward: Reward = new Reward;
  private rewards: Reward[] = [];
  private isProcessing: boolean = false;

  constructor(private projectCreationFormService: ProjectCreationFormService) { }

  ngOnInit() {
    
  }

  addReward(){
    this.rewards.push(this.currentReward);    
    this.currentReward = new Reward();
  }

  onSubmit(){
    this.projectCreationFormService.addRewards(this.rewards);

    this.projectCreationFormService.addProject().subscribe(id => {
      this.projectCreationFormService.setProjectId(+id);
      this.projectCreationFormService.setFormLocation(FormLocation.UPLOAD_IMAGE);
    }, error => {
      console.log(error);
    })
  }

}
