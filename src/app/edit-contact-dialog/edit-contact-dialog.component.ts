import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { InputService } from '../shared/services/input.service';
import { ContactsService } from '../shared/services/contacts.service';

@Component({
  selector: 'app-edit-contact-dialog',
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss']
})
export class EditContactDialogComponent implements OnInit {

  @Input() detailContact: any;
  

  editContactForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.pattern(/^[A-Z]+[a-zßäöü]+ [A-Z]+[a-zßäöü]+$/),
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

  ngOnInit() {
    this.editContactForm.get('name')?.setValue(this.detailContact.name);
    this.editContactForm.get('email')?.setValue(this.detailContact.email);
    this.editContactForm.get('phoneNumber')?.setValue(this.detailContact.phoneNumber);

  }

  async getEditContactData() {
    await this.contactsservice.editContact(
      this.editContactForm.get('name')?.value,
      this.editContactForm.get('email')?.value,
      this.editContactForm.get('phoneNumber')?.value,
      this.detailContact.color)
    this.editContactForm.reset();
    this.contactsservice.closeEditContact('editContactForm');
  }

}
