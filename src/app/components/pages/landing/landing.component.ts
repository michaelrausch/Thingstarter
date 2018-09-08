import { Component, OnInit } from '@angular/core';
import { ProjectService } from "app/services/project.service";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(public projectService: ProjectService) { }

  ngOnInit() {
  }

}
