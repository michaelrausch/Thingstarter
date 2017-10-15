import { Component, OnInit } from '@angular/core';
import { Reward, FormLocation, ProjectCreationFormService } from "app/services/project-creation-form.service";
import { NgForm, NgModel, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-project-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})
export class RewardsComponent implements OnInit {
  private formChanged: boolean = false;
  private currentReward: Reward = new Reward;
  private rewards: Reward[] = [];
  private isProcessing: boolean = false;

  constructor(private projectCreationFormService: ProjectCreationFormService) { }

  ngOnInit() {
    
  }

  addReward(){
    this.currentReward.amount = this.currentReward.amount * 100;

    this.rewards.push(this.currentReward);    
    this.currentReward = new Reward();
    this.formChanged = false;
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

  removeReward(index: number){
    var newRewards = new Array();

    for (let i = 0; i < this.rewards.length; i++){
      if (i != index) newRewards.push(this.rewards[i]);
    }
    
    this.rewards = newRewards;
  }

  editReward(index: number){
    var r: Reward;

    for (let i = 0; i < this.rewards.length; i++){
      if (i == index) {
        this.currentReward = new Reward();
        this.currentReward.description = this.rewards[i].description;
        this.currentReward.amount = this.rewards[i].amount / 100;
      }
    }

    this.removeReward(index);
  }

  setFormChanged(){
    this.formChanged = true;
  }

}
