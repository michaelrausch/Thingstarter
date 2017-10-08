import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css']
})
export class RewardComponent implements OnInit {
  @Input() amount;
  @Input() description;
  @Input() isCustomPledge = false;

  constructor() { }

  ngOnInit() {
    
  }

  clicked(){
    
  }

}
