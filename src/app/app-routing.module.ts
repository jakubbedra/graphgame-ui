import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRegistrationComponent} from "./user-registration/user-registration.component";
import {UserPasswordRecoveryComponent} from "./user-password-recovery/user-password-recovery.component";

const routes: Routes = [
  {path: 'auth', component: UserRegistrationComponent},
  {path: 'auth/recovery', component: UserPasswordRecoveryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
