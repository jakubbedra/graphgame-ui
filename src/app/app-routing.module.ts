import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRegistrationComponent} from "./user-registration/user-registration.component";
import {UserPasswordRecoveryComponent} from "./user-password-recovery/user-password-recovery.component";
import {UserProgressComponent} from "./users/user-progress/user-progress.component";
import {TopUsersComponent} from "./users/top-users/top-users.component";

const routes: Routes = [
  {path: 'auth', component: UserRegistrationComponent},
  {path: 'auth/recovery', component: UserPasswordRecoveryComponent},
  {path: 'my-progress', component: UserProgressComponent},
  {path: 'top-charts', component: TopUsersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
