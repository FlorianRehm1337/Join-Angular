import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  constructor() { }
  windowWidth: number = window.innerWidth;

  @HostListener('window:resize') onResize(){

    this.windowWidth = window.innerWidth;
    if (this.windowWidth > 1000) {
      this.isDesktopView = true;
    } else {
      this.isDesktopView = false;
    }
  }


  detailView: boolean = false; //hide contactlist
  isDesktopView: boolean = false;
  ngOnInit(): void {
  }

  openDetailView(){
    this.detailView = true;
  }

  closeDetailView(){
    this.detailView = false;
  }

  openAddContact(){

  }

}
