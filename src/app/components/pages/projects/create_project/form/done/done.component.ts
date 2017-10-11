import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-project-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
export class DoneComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout( _ => {
      this.router.navigate(['./explore']);
    }, 1000);
  }

}
