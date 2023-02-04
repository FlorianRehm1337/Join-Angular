import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { InputService } from '../shared/services/input.service';

@Component({
  selector: 'app-edit-contact-dialog',
  templateUrl: './edit-contact-dialog.component.html',
  styleUrls: ['./edit-contact-dialog.component.scss']
})
export class EditContactDialogComponent implements OnInit {

  editContactForm = new FormGroup({
    name: new FormControl('', Validators.compose([
      Validators.pattern(/^[A-Z]+[a-z]+ [A-Z]+[a-z]+$/),
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

  constructor(public inputservice: InputService) { }

  ngOnInit(): void {
  }

  editContact() {

  }

}
