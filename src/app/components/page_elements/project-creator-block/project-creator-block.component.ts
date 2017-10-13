import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-project-creator-block',
  templateUrl: './project-creator-block.component.html',
  styleUrls: ['./project-creator-block.component.css']
})
export class ProjectCreatorBlockComponent implements OnInit {
  @Input() createdBy: string;
  @Input() creationDate: string;

  constructor() { }

  ngOnInit() {
  }

}
