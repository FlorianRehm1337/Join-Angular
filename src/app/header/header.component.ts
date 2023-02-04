import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  menuOpened = false;
  contactsOpened = false;

  constructor(public router: Router, public authservice: AuthService) { }

  ngOnInit(): void {

  }

  logOut(){
    this.authservice.auth.signOut();
    this.router.navigate(['login/']);
  }

  openMenu(){
    this.menuOpened = !this.menuOpened;
  }

}
