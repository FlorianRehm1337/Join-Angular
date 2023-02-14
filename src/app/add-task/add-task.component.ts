import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    title: new FormControl('', Validators.compose([
      Validators.required
    ])),
    description: new FormControl('', Validators.compose([
      Validators.required
    ])),
    priority: new FormControl('', Validators.compose([
      Validators.required
    ])),
    presentDate: new FormControl((new Date()).toISOString().substring(0, 10), Validators.compose([
      Validators.required,
    ])),
    category: new FormControl('', Validators.compose([
      Validators.required
    ])),
    assignees: new FormControl('', Validators.compose([
      Validators.required
    ])),
    /* subtasks: new FormControl('', Validators.compose([
      Validators.pattern(/^[A-Z]+[a-zßäöü]+ [A-Z]+[a-zßäöü]+$/),
      Validators.required
    ])), */

  });

  allCategories: any = [];
  allContacts: any = [];
  allCheckedSubtasks: any = [];

  createdSubtasks: any = [];
  selectedPrio: string = '';
  categoriesOpened: boolean = false;
  asigneesOpened: boolean = false;
  newCategoryOpened: boolean = false;
  newCategoryValue: string = '';
  newCategoryColorValue: string = '';
  choosenCategory: any;
  categorySelected: boolean = false;
  subtaskInput: string = '';
  date: string | number | Date | undefined;
  constructor(public router: Router, public contactsservice: ContactsService, public firestoreService: FirestoreService, public authService: AuthService) { }

  async ngOnInit() {
    this.date = new Date;
    await this.authService.checkAuthState();
    await this.firestoreService.getCurrentuser();
    this.allCategories = this.firestoreService.currentUserData.categories;
    this.allContacts = this.firestoreService.currentUserData.contacts;

  }

  getActiveButton(prio: string) {
    this.selectedPrio = prio;
    console.log(this.selectedPrio);
  }

  openCategories() {
    this.categoriesOpened = !this.categoriesOpened;
  }

  openAssignees() {
    this.asigneesOpened = !this.asigneesOpened;
  }

  showInputField() {
    this.newCategoryOpened = !this.newCategoryOpened;
  }

  chooseCategory(i: number) {
    this.choosenCategory = this.allCategories[i];
    this.categorySelected = true;
    console.log(this.choosenCategory);
  }

  cancelCategory() {
    this.newCategoryOpened = !this.newCategoryOpened;
    this.newCategoryValue = '';
    this.newCategoryColorValue = '';
    this.categorySelected = false;
  }

  async addCategory() {
    const newCategory = {
      color: this.newCategoryColorValue,
      name: this.newCategoryValue,
    }

    this.allCategories.push(newCategory);
    await this.firestoreService.updateUserCategories(this.allCategories);
    this.cancelCategory;
  }

  deleteCategory(i: number) {
    this.allCategories.splice(i, 1);
    this.firestoreService.updateUserCategories(this.allCategories);
  }

  handleChecked(i: number,event: Event) {
    event.stopPropagation();
    this.allContacts[i].checked = !this.allContacts[i].checked;
    this.firestoreService.updateUserContacts(this.allContacts);
  }

  addSubtask() {
    this.createdSubtasks.push(this.subtaskInput);
    this.subtaskInput = '';
  }

  deleteSubtask(i: number) {
    this.createdSubtasks.splice(i, 1);
  }

  cancelTask() {

  }

  createTask() {

  }
}


