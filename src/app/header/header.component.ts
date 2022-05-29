import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../users/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub: Subscription;

  active: number;

  isAuthenticated: boolean = false;

  username: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.username = "chujchuj";
    this.active = -1;
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.username = user.username;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onClickLink(index) {
    this.active = index;
  }

  onLogout() {
    this.authService.logout().subscribe(response => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(['./auth']);
      });
    });
  }

}
