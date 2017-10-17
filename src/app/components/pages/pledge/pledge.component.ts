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

  wasError: boolean = false;
  showMessage: boolean = false;
  resultMessage: string = "";
  isProcessing: boolean = false;
  projectId: string;

  pledgeAmount: number = 0;
  isAnon: boolean = false;

  constructor(private route: ActivatedRoute, private loginService: LoginService, private router: Router, private projectService: ProjectService) { }

  ngOnInit() {
    if(!this.loginService.isLoggedIn()){
      this.loginService.setPostLoginRedirect(this.router.url);
      this.loginService.setLoginFlash("You must log in before you can pledge");
      this.loginService.redirectToLogin();
    }

    this.pledgeAmount = this.projectService.getPledgeAmount();
    
    if (!this.pledgeAmount){
      this.pledgeAmount = 0;
    }

    this.pledgeAmount /= 100;
    
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
    });
    
    var elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  submitForm(){
    this.isProcessing = true;

    if (this.pledgeAmount < 0){
      this.isProcessing = false;
      return this.showError("You must enter a positive pledge amount");
    }

    this.stripe.createToken(this.card).then(result => {
      this.isProcessing = false;

      if (result.error) {
        return this.showError("Transaction declined");
      } else {
        this.processTransactionResult(result.token.id);
        return this.showSuccess("Transaction Accepted")
      }
    });
  }

  private processTransactionResult(token: string){


    this.projectService.pledge(+this.projectId, this.loginService.userId, this.pledgeAmount * 100, this.isAnon, token).subscribe(() =>{
      this.router.navigate(['./project/' + this.projectId]);
    }, error =>{
      this.showError(error.error);
      this.isProcessing = false;
    });
  }

  private showError(message: string){
    this.showMessage = true;
    this.wasError = true;
    this.resultMessage = message;

  }

  private showSuccess(message: string){
    this.showMessage = true;
    this.wasError = false;
    this.resultMessage = message;
  }

}
