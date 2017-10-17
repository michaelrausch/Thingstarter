import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ProjectCreationFormService } from 'app/services/project-creation-form.service';

@Component({
  selector: 'app-create-project-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
export class DoneComponent implements OnInit {

  constructor(private router: Router, private formCreationService: ProjectCreationFormService) { }

  ngOnInit() {
    setTimeout( _ => {
      this.router.navigate(['./project/' + this.formCreationService.getProjectId()]);
    }, 1000);
  }

}
