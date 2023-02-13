import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { ContactsService } from '../shared/services/contacts.service';
import { FirestoreService } from '../shared/services/firestore.service';
import { AuthService } from '../shared/services/auth.service';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  animations: [
    trigger('openCategories', [
      state('start', style({
        height: '44px',
        overflow: 'hidden',
      })),
      state('end', style({
        overflow: 'scroll',
        height: '*',
})),
  transition('end <=> start', animate('200ms ease-in-out'))
    ]),
  ]
})
export class AddTaskComponent implements OnInit {

  addTaskForm = new FormGroup({
    'presentDate': new FormControl((new Date()).toISOString().substring(0, 10)),
  })

  currentSelection: string = '';
  categoriesOpened: boolean = false;
  asigneesOpened: boolean = false;
  newCategory: boolean = false;
  date: string | number | Date | undefined;
  constructor(public router: Router, public contactsservice: ContactsService, public firestoreService: FirestoreService, public authService: AuthService) { }

  async ngOnInit() {
    this.date = new Date;
    await this.authService.checkAuthState()
    await this.firestoreService.getCurrentuser();
    console.log(this.firestoreService.currentUserData)

  }

  getActiveButton(prio: string) {
    this.currentSelection = prio;
    console.log(this.currentSelection);
  }

  openCategories() {
    this.categoriesOpened = !this.categoriesOpened;
  }

  openAssignees(){
    this.asigneesOpened = !this.asigneesOpened;
  }

  showInputField() {
    this.newCategory = !this.newCategory;
  }

  cancelCategory() {
    this.newCategory = !this.newCategory;
  }

  addCategory() {

  }

  addSubtask(){

  }

  cancelTask(){

  }

  createTask(){

  }
}


