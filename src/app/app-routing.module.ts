import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRegistrationComponent} from "./user-registration/user-registration.component";
import {UserProgressComponent} from "./users/user-progress/user-progress.component";
import {TopUsersComponent} from "./users/top-users/top-users.component";
import {GameComponent} from "./game/game.component";
import {HomeComponent} from "./home/home.component";
import {KatexModule} from "ng-katex";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'auth', component: UserRegistrationComponent},
  {path: 'my-progress', component: UserProgressComponent},
  {path: 'top-charts', component: TopUsersComponent},
  {path: 'game', component: GameComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    KatexModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
