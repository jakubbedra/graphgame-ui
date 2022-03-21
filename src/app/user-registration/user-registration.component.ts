import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {AuthService} from "../users/auth.service";
import {Router} from "@angular/router";

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginMode = true;
    this.email = "";
    this.token = "";
    this.passwordRetype = "";
  }

  ngOnInit(): void {
    console.log(this.loginMode);
  }

  onSubmitLogin(formData: NgForm): void {
   const email = formData.value.email;
   const password = formData.value.password;
   console.log(email+"_DUPA_"+password);
//
    var authObs = this.authService.login(email, password);
    authObs.subscribe(
      resData => {
        this.router.navigate(['./my-progress']);
      }
    );
  }

  onSubmitRegister(formData: NgForm): void {

  }

  onClickChangeMode(): void {
    this.loginMode = !this.loginMode;
  }

}
