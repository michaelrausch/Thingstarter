import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-funding-status',
  templateUrl: './funding-status.component.html',
  styleUrls: ['./funding-status.component.css']
})
export class FundingStatusComponent implements OnInit {
  @Input() pledged: number;
  @Input() goal: number;
  @Input() numBackers: number;

  constructor() { }

  ngOnInit() {
  }

}
