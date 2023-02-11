import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { InputService } from '../shared/services/input.service';
import { ContactsService } from '../shared/services/contacts.service';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.scss']
})
export class AddContactDialogComponent implements OnInit {

  newContactForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.pattern(/^[A-Z]+[a-zß]+ [A-Z]+[a-zß]+$/),
      Validators.required
    ])),
    email: new FormControl('', Validators.compose([
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      Validators.minLength(6),
      Validators.required
    ])),
    phoneNumber: new FormControl('', Validators.compose([
      Validators.pattern(/(^\d{5,15}$)|(^\d{5}-\d{4}$)/),
      Validators.required
    ])),
  });

  constructor(public inputservice: InputService, public contactsservice: ContactsService) { }

  ngOnInit(): void {
  }

  async getNewContactData(){
    await this.contactsservice.createNewContact(this.inputservice.name, this.inputservice.email, this.inputservice.phoneNumber)
    this.newContactForm.reset();
    this.contactsservice.closeAddContact('createNewContact');
  }



}
