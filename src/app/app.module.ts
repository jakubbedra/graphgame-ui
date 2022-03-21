import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import {FormsModule} from "@angular/forms";
import { UserPasswordRecoveryComponent } from './user-password-recovery/user-password-recovery.component';
import {AuthService} from "./users/auth.service";
import { UserProgressComponent } from './users/user-progress/user-progress.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserRegistrationComponent,
    UserPasswordRecoveryComponent,
    UserProgressComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
