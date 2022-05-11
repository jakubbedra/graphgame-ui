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
  invalidPassword: boolean;
  //login
  email: string;
  password: string;
  token: string;
  //register
  email1: string;
  username: string;
  password1: string;
  password2: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginMode = true;
    this.email = "";
    this.token = "";
    this.password = "";
    this.email1 = "";
    this.username = "";
    this.password1 = "";
    this.password2 = "";
    this.invalidPassword = false;
  }

  ngOnInit(): void {
    console.log(this.loginMode);
  }

  onSubmitLogin(formData: NgForm): void {
    const email = formData.value.email;
    const password = formData.value.password;
    console.log(email + "_DUPA_" + password);

    var authObs = this.authService.login(email, password);
    //todo: if authorization successfull!!!
    authObs.subscribe(
      resData => {
        this.router.navigate(['./my-progress']);
      }
    );
  }

  onSubmitRegister(formData: NgForm): void {
    const email1 = formData.value.email1;
    const password1 = formData.value.password1;
    const password2 = formData.value.password2;
    const username1 = formData.value.username;

    console.log(username1);
    //console.log(email + "DUPA");
    console.log(password1);
    console.log(password2);
    if (password1 == password2) {
      this.authService.register(username1, email1, password1).subscribe(
        resData => {
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['./auth']);
          });
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
