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

  MAX_PASSWORD_LENGHT = 50;
  MAX_USERNAME_LENGHT = 30;

  lengthError = {
    username: false,
    usernameRegex: false,
    password: false,
    passwordRegex: false
  }

  serverError = {
    usernameExists: false,
    usernameOrPasswordInvalid: false
  }

  loginMode: boolean;
  invalidPassword: boolean;
  //login
  usernameLogin: string;
  password: string;
  token: string;
  //register
  username: string;
  password1: string;
  password2: string;

  regexPassword: RegExp;
  regexUsername: RegExp;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginMode = true;
    this.usernameLogin = "";
    this.token = "";
    this.password = "";
    this.username = "";
    this.password1 = "";
    this.password2 = "";
    this.invalidPassword = false;
    this.regexUsername = new RegExp(/^[a-zA-Z0-9.@\-_]{5,}$/g);
    this.regexPassword = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[ -~]{8,}/g);
  }

  ngOnInit(): void {
  }

  onSubmitLogin(formData: NgForm): void {
    const username = formData.value.username;
    const password = formData.value.password;

    if (
      username.length > this.MAX_USERNAME_LENGHT ||
      password.length > this.MAX_PASSWORD_LENGHT
    ) {
      return;
    }

    var authObs = this.authService.login(username, password);
    authObs.subscribe(
      resData => {
        if (resData != null) {
          this.router.navigate(['./my-progress']);
          this.serverError.usernameOrPasswordInvalid = false;
        } else {
          this.serverError.usernameOrPasswordInvalid = true;
        }
      }
    );
  }

  onSubmitRegister(formData: NgForm): void {
    const password1 = formData.value.password1;
    const password2 = formData.value.password2;
    const username1 = formData.value.username;

    this.lengthError["password"] = false;
    this.lengthError["username"] = false;
    this.lengthError["passwordRegex"] = false;
    this.lengthError["usernameRegex"] = false;

    if (
      password1.length > this.MAX_PASSWORD_LENGHT ||
      username1.length > this.MAX_USERNAME_LENGHT
    ) {
      this.lengthError["password"] = password1.length > this.MAX_PASSWORD_LENGHT;
      this.lengthError["username"] = username1.length > this.MAX_USERNAME_LENGHT;
      return;
    }

    var usernameValid = this.regexUsername.test(username1);
    var passwordValid = this.regexPassword.test(password1);
    if (!usernameValid || !passwordValid) {
      this.lengthError["passwordRegex"] = !passwordValid;
      this.lengthError["usernameRegex"] = !usernameValid;
      return;
    }


    if (password1 == password2) {
      this.authService.register(username1, password1).subscribe(
        resData => {
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['./auth']);
            this.serverError.usernameExists = false;
          });
        }, error => {
          this.serverError.usernameExists = true;
        }
      );
    } else {
      this.invalidPassword = true;
    }
  }

  onClickChangeMode(): void {
    this.loginMode = !this.loginMode;
  }

}
