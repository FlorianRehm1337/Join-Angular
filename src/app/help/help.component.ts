import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  lastRoute: string | undefined;
  constructor(private router: Router) {

    if (this.router.getCurrentNavigation()?.previousNavigation) {
      this.lastRoute = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();
    } else {
      this.lastRoute = '/summary';
    }
  }

  ngOnInit(): void {
  }

}
