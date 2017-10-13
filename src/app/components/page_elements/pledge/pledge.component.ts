import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pledge-detail',
  templateUrl: './pledge.component.html',
  styleUrls: ['./pledge.component.css']
})
export class PledgeDetailComponent implements OnInit {
  @Input() username: string;
  @Input() amount: number;
  constructor() { }

  ngOnInit() {
  }

}
