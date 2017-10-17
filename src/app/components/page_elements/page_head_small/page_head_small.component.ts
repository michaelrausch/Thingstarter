import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-head-small',
  templateUrl: './page_head_small.component.html',
  styleUrls: ['./page_head_small.component.css']
})
export class PageHeadSmallComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  @Input() title: string;

}
