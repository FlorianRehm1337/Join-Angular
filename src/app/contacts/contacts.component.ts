import { Component, HostListener, OnInit } from '@angular/core';
import { ContactsService } from '../shared/services/contacts.service';
import { FirestoreService } from '../shared/services/firestore.service';
import { AuthService } from '../shared/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('from', style({
        bottom: '-100px'
      })),
      state('to', style({
        bottom: '100px'
      })),
      transition('* => closed', [
        animate('1s')
      ]),
      transition('* => open', [
        animate('0.5s')
      ]),
    ]),
  ],
})
export class ContactsComponent implements OnInit {

  constructor(public contactsservice: ContactsService, public firestoreService: FirestoreService, public authService: AuthService) { }


  windowWidth: number = window.innerWidth;
  openedAddNewContact: boolean = false;
  contactIndex: number = 0;
  selectedIndex!: number;
  detailView: boolean = false; //hide contactlist
  isDesktopView: boolean = true;

  allCharacters: Array<any> = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z'];

  @HostListener('window:resize') onResize(){

    this.windowWidth = window.innerWidth;
    if (this.windowWidth > 1000) {
      this.isDesktopView = true;
    } else {
      this.isDesktopView = false;
    }
  }

  async ngOnInit() {
    await this.authService.checkAuthState()
    await this.firestoreService.getCurrentuser();
    this.contactsservice.loadContactsFromDB();
  }

  openDetailView(contactEmail: string){
    this.detailView = true;
    this.contactIndex = this.contactsservice.allContacts.findIndex(contact => contact.email == contactEmail);
  }

  closeDetailView(){
    this.detailView = false;
  }

  filterCharacters(character: string){
    return this.contactsservice.allContacts.filter(contact => contact.name[0] == character);
  }

  editContact(currentDetailContact: Object){
    this.contactsservice.openEditContact = true;
    console.log(currentDetailContact);
  }

  deleteContact(){
    this.contactsservice.allContacts.splice(this.contactIndex, 1);
    this.firestoreService.updateUserContacts(this.contactsservice.allContacts);
    this.closeDetailView();
  }

  handleActiveContact(i: number){
    this.selectedIndex = i;
  }

}
