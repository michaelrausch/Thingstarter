import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-project-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  private currentStep: FormStep;

  constructor() { 
    this.currentStep = FormStep.BASICS;
  }

  ngOnInit() {
    
  }
}

export enum FormStep {
  BASICS, REWARDS, IMAGE, DONE
}