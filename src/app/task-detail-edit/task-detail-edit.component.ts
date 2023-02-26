import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FirestoreService } from '../shared/services/firestore.service';
import { AuthService } from '../shared/services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ContactsService } from '../shared/services/contacts.service';

@Component({
  selector: 'app-task-detail-edit',
  templateUrl: './task-detail-edit.component.html',
  styleUrls: ['./task-detail-edit.component.scss'],
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
export class TaskDetailEditComponent implements OnInit {

  allTasks: any[] = [];
  allContacts: any[] = [];

  clickedTask: any;
  detailTask: any;
  selectedPrio: string = '';
  asigneesOpened: boolean = false;
  @Input() taskToEdit: any;
  @Output() editTaskOpened: EventEmitter<any> = new EventEmitter();
  taskIndex: number = 0;

  constructor(public firestoreService: FirestoreService, public authService: AuthService, public contactsService: ContactsService) { }

  async ngOnInit() {
    await this.authService.checkAuthState();
    await this.firestoreService.getCurrentuser();
    this.allTasks = this.firestoreService.currentUserData.allTasks;
    this.allContacts = this.firestoreService.currentUserData.contacts;
    this.getActiveButton(this.taskToEdit.priority);
    this.taskIndex = this.allTasks.findIndex(task => task.title == this.taskToEdit.title)
    this.refreshCheckedAssignees();
  }

  getPrioImage(taskPrio: string) {

    switch (taskPrio) {
      case 'low':
        return 'assets/img/icon-low-white.svg';

      case 'medium':
        return 'assets/img/icon-medium-white.svg';

      case 'urgent':
        return 'assets/img/icon-urgent-white.svg';

      default:
        return '';
    }
  }

  getPrioBackground(taskPrio: string) {
    switch (taskPrio) {
      case 'low':
        return '#7AE229';

      case 'medium':
        return '#FFA800';

      case 'urgent':
        return '#FF3D00';

      default:
        return '';
    }
  }

  getActiveButton(prio: string) {

    switch (prio) {
      case 'low':
        this.selectedPrio = 'low';
        this.taskToEdit.priority = 'low';
        return

      case 'medium':
        this.selectedPrio = 'medium';
        this.taskToEdit.priority = 'medium';
        return

      case 'urgent':
        this.selectedPrio = 'urgent';
        this.taskToEdit.priority = 'urgent';
        return

      default: '';
        return '';
    }

  }

  openAssignees() {
    this.asigneesOpened = !this.asigneesOpened;
  }

  handleChecked(i: number, event: Event) {
    event.stopPropagation();
    this.taskToEdit.assignee[i].checked = !this.taskToEdit.assignee[i].checked;
  }

  saveTaskChanges() {
    let checkedAssignees = this.taskToEdit.assignee.filter((contact: { checked: any; }) => contact.checked)
    this.taskToEdit.assignee = checkedAssignees;
    this.allTasks[this.taskIndex] = this.taskToEdit;
    this.firestoreService.updateUserTasks(this.allTasks);
    this.editTaskOpened.emit(false)
  }

  refreshCheckedAssignees() {
    for (let i = 0; i < this.allContacts.length; i++) {
      const element = this.allContacts[i].name;
      if (!this.taskToEdit.assignee.some((contact: { name: any; }) => contact.name === element)) {
        this.taskToEdit.assignee.push(this.allContacts[i]);
      }
    }
  }

  getDateValue(event:any){
    this.taskToEdit.date = event;
  }

}
