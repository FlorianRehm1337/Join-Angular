import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-notice',
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent implements OnInit {

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
