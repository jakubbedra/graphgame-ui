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
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { TopUsersComponent } from './users/top-users/top-users.component';
import {TopUsersService} from "./users/top-users.service";
import {TaskService} from "./tasks/task.service";
import {UserStatsService} from "./users/user-stats.service";
import { GameComponent } from './game/game.component';
import {AuthInterceptorService} from "./users/auth-interceptor.service";
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserRegistrationComponent,
    UserPasswordRecoveryComponent,
    UserProgressComponent,
    TopUsersComponent,
    GameComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    TopUsersService,
    TaskService,
    UserStatsService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
