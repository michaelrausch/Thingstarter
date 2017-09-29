import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-minijumbo',
  templateUrl: './minijumbo.component.html',
  styleUrls: ['./minijumbo.component.css']
})
export class MiniJumboComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() title: string;

}
