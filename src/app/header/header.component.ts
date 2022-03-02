import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  active: number;

  constructor() {
    this.active = -1;
  }

  ngOnInit(): void {
  }

  onClickLink(index) {
    this.active = index;
  }

}
