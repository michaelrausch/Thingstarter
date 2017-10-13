import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  @Input() title;
  @Input() subtitle;
  @Input() imageUri;
  @Input() id;

  easterEgg = false;

  constructor() { }

  ngOnInit() {
  }

  setEasterEgg(){
    this.easterEgg = true;
  }
}
