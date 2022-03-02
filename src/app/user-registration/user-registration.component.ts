import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  loginMode: boolean;
  email: string;
  username: string;
  password: string;
  passwordRetype: string;
  token: string;

  constructor() {
    this.loginMode = true;
    this.email = "";
    this.token = "";
    this.passwordRetype = "";
  }

  ngOnInit(): void {
    console.log(this.loginMode);
  }

  onSubmitLogin(formData: NgForm): void {

  }

  onSubmitRegister(formData: NgForm): void {

  }

  onClickChangeMode(): void {
    this.loginMode = !this.loginMode;
  }

}
