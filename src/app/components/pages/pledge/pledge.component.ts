import { Component, OnInit } from '@angular/core';
import { LoginService } from "app/services/login.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ProjectService } from "app/services/project.service";

@Component({
  selector: 'app-pledge',
  templateUrl: './pledge.component.html',
  styleUrls: ['./pledge.component.css']
})
export class PledgeComponent implements OnInit {
  stripe = (<any>window).Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
  card;

  wasSuccessful: boolean = false;
  hadError: boolean = false;
  resultMessage: string = "";
  isProcessing: boolean = false;
  projectId: string;

  pledgeAmount: number = 0;

  constructor(private route: ActivatedRoute, private loginService: LoginService, private router: Router, private projectService: ProjectService) { }

  ngOnInit() {
    if(!this.loginService.isLoggedIn()){
      this.loginService.setPostLoginRedirect(this.router.url);
      this.loginService.redirectToLogin();
    }

    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
    
    var elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  submitForm(){
    this.isProcessing = true;
    console.log(this.pledgeAmount);

    this.stripe.createToken(this.card).then(result => {
      if (result.error) {
        this.resultMessage = "Transaction Declined";
        this.hadError = true;
        this.wasSuccessful = false;
      } else {
        this.wasSuccessful = true;
        this.hadError = false;
        this.resultMessage = "Transaction Accepted";
        this.processTransactionResult(result.token.id);
      }
    });


  }

  private processTransactionResult(token: string){
    this.projectService.pledge(1, this.loginService.userId, 42069, false, token).subscribe(() =>{
      this.router.navigate(['./project/' + this.projectId]);
    }, error =>{
      this.hadError = true;
      this.wasSuccessful = false;
      this.resultMessage = error.error;
    });
  }

}
