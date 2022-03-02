import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-password-recovery',
  templateUrl: './user-password-recovery.component.html',
  styleUrls: ['./user-password-recovery.component.css']
})
export class UserPasswordRecoveryComponent implements OnInit {

  recoveryPhase: number;
  email: string;
  password: string;
  passwordRetype: string;
  token: string;

  constructor() {
    this.recoveryPhase = 0;
    this.token = "";
    this.email = "";
    this.password = "";
    this.passwordRetype = "";
  }

  ngOnInit(): void {
    this.recoveryPhase = 0;
    this.token = "";
    this.email = "";
    this.password = "";
    this.passwordRetype = "";
  }


  onRecovery(): void {
    this.recoveryPhase = 0;
  }

  //todo
  onSubmitRecovery(): void {
    this.recoveryPhase++;
    /*
    * -disable email textbox and hide back button
    * -show enter token box
    * -disable token box
    * -show new password and retype new password
    * * */
  }

}
