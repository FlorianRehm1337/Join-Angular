import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactsService } from '../shared/services/contacts.service';
import { FirestoreService } from '../shared/services/firestore.service';
import { AuthService } from '../shared/services/auth.service';
import { Task } from '../shared/services/task';
import { InputService } from '../shared/services/input.service';
import { TaskService } from '../shared/services/task.service';
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
    date: new FormControl((new Date()).toISOString().slice(0, 10), Validators.compose([
      Validators.required,
    ])),
    category: new FormControl([], Validators.compose([
      Validators.required
    ])),

  });

  allCategories: any = [];
  allContacts: any = [];
  allTasks: any = [];
  formSubmitted = false;

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

  constructor(public router: Router,
    public contactsservice: ContactsService,
    public firestoreService: FirestoreService,
    public authService: AuthService,
    public inputservice: InputService,
    public taskService: TaskService) { }

  async ngOnInit() {
    //this.date = new Date();
    await this.authService.checkAuthState();
    await this.firestoreService.getCurrentuser();
    this.allCategories = this.firestoreService.currentUserData.categories;
    this.allContacts = this.firestoreService.currentUserData.contacts;
    this.allTasks = this.firestoreService.currentUserData.allTasks;
  }

  getActiveButton(prio: string) {
    this.selectedPrio = prio;
    this.addTaskForm.value.priority = prio;
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
    this.addTaskForm.value.category = this.choosenCategory;  }

  cancelCategory() {
    this.newCategoryOpened = !this.newCategoryOpened;
    this.newCategoryValue = '';
    this.newCategoryColorValue = '';
    this.categorySelected = false;
    this.choosenCategory = undefined;
  }

  async addCategory() {
    if (this.newCategoryColorValue != '' && this.newCategoryValue != '') {
      const newCategory = {
        color: this.newCategoryColorValue,
        name: this.newCategoryValue,
      }

      this.allCategories.push(newCategory);
      await this.firestoreService.updateUserCategories(this.allCategories);
      this.cancelCategory();
    } else {
      this.cancelCategory();
    }

  }

  deleteCategory(i: number) {
    this.allCategories.splice(i, 1);
    this.firestoreService.updateUserCategories(this.allCategories);
  }

  handleChecked(i: number, event: Event) {
    event.stopPropagation();
    this.allContacts[i].checked = !this.allContacts[i].checked;
    //this.firestoreService.updateUserContacts(this.allContacts);
  }

  handleSubtaskCheck(i: number, event: Event) {
    event.stopPropagation();
    this.createdSubtasks[i].checked = !this.createdSubtasks[i].checked;
  }

  addSubtask() {
    if (this.subtaskInput.length != 0) {
      this.createdSubtasks.push({
        subtask: this.subtaskInput,
        checked: false,
      });
      this.subtaskInput = '';
    }
  }

  deleteSubtask(i: number) {
    this.createdSubtasks.splice(i, 1);
  }

  cancelTask() {
    console.log('task cancelled');
    this.selectedPrio = '';
    this.subtaskInput = '';
    this.createdSubtasks = [];
    this.addTaskForm.reset();
    for (let i = 0; i < this.allContacts.length; i++) {
      this.allContacts[i].checked = false;
    }
    this.cancelCategory();
    this.cancelCategory();
    this.formSubmitted = false;
  }

  async createNewTask() {
    this.formSubmitted = true;
    console.log(this.addTaskForm)
    debugger;
    if (this.checkFormValidation()) {
      let selectedAssignees = this.allContacts.filter((contact: { checked: any; }) => contact.checked);
      let allCheckedSubtasks = this.createdSubtasks.filter((subtask: { checked: any; }) => subtask.checked);
      allCheckedSubtasks.forEach((subtask: { checked: boolean }) => { subtask.checked = false });
      const newTask = {
        title: this.addTaskForm.value.title,
        description: this.addTaskForm.value.description,
        priority: this.addTaskForm.value.priority,
        date: this.addTaskForm.value.date,
        category: this.addTaskForm.value.category,
        assignee: selectedAssignees ? selectedAssignees : [],
        subtasks: allCheckedSubtasks ? allCheckedSubtasks : [],
        status: 'todo',
      }
      this.allTasks.push(newTask);
      await this.firestoreService.updateUserTasks(this.allTasks);
      this.cancelTask();
      this.taskService.createdTask = true;

      setTimeout(() => {
        this.taskService.createdTask = false;
        this.router.navigateByUrl('/board')
      }, 1500)
    }

  }

  checkFormValidation() {
    if (this.addTaskForm.value.title != '' &&
     this.addTaskForm.value.description != '' &&
      this.addTaskForm.value.priority != '' &&
      this.addTaskForm.value.date != '' &&
       this.addTaskForm.value.category != undefined) {
        return true;
    }else{
      return false;
    }
  }
}
