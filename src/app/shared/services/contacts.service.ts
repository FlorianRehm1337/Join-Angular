import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  openAddNewContact: boolean = false;
  openEditContact: boolean = false;
  allContacts: any[] = [];
  possibleHexcolorCharacters: any[] = [
    'A', 'B', 'C', 'D', 'E', 'F',
    '0', '1', '2', '3', '4',
    '5', '6', '7', '8', '9',
  ];

  constructor(public firestoreService: FirestoreService) { }



  loadContactsFromDB() {
    console.log(this.firestoreService.currentUserData);
    this.allContacts = this.firestoreService.currentUserData.contacts;
    console.log(this.allContacts);
  }

  openAddContact() {
    this.openAddNewContact = true;
  }

  closeEditContact(form: any){
    this.openEditContact = false;
    try {
      form.reset();
    } catch (e) {
      return
    }
  }

  closeAddContact(form: any) {
    this.openAddNewContact = false;
    try {
      form.reset();
    } catch (e) {
      return
    }

  }

  async createNewContact(name: string, email: string, phoneNumber: string) {

    const newContact = {
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      color: this.getColor(),
      checked: false,
    }

    this.allContacts.push(newContact);
    this.firestoreService.updateUserContacts(this.allContacts);
  }

  async editContact(name: string, email: string, phoneNumber: string, color: string) {
    let currentEditedContact = this.allContacts.findIndex(contact => contact.color == color);
    this.allContacts[currentEditedContact].name = name;
    this.allContacts[currentEditedContact].email = email;
    this.allContacts[currentEditedContact].phoneNumber = phoneNumber;
    this.firestoreService.updateUserContacts(this.allContacts);
  }

  getColor() {
    let min = Math.ceil(0);
    let max = Math.floor(16);
    let generatedCode: string = '#';
    for (let i = 0; i < 6; i++) {
      let generatedIndex = Math.random() * (max - min) + min;
      if (generatedIndex == 16) {
        generatedIndex = 15;
      }
      generatedCode += this.possibleHexcolorCharacters[Math.floor(generatedIndex)];
    }
    return generatedCode;
  }
}
