import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  constructor(public authservice: AuthService) { }

  ngOnInit(): void {
    this.authservice.checkAuthState();
  }

  currentUser :any;

}
