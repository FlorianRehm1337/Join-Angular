import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContactsService } from '../shared/services/contacts.service';
import { AuthService } from '../shared/services/auth.service';
import { FirestoreService } from '../shared/services/firestore.service';
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  allTasks: any[] = [];
  @Input() windowWidth: any;
  @Input() clickedTask: any;
  @Output() showTaskDetail = new EventEmitter<boolean>();
  detailTask: any;
  editTaskOpened: boolean = false;
  taskIndex: number = 0;
  constructor(public router: Router, public firestoreService: FirestoreService, public authService: AuthService, public contactsService: ContactsService) {}

  async ngOnInit() {
    await this.authService.checkAuthState();
    await this.firestoreService.getCurrentuser();
    this.allTasks = this.firestoreService.currentUserData.allTasks;
    this.taskIndex = this.allTasks.findIndex(task => task.title == this.clickedTask.title)
  }

  closeTaskDetail() {
    this.showTaskDetail.emit(false)
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
        return 'assets/img/icon-medium-white.svg';
    }
  }

  getPrioName(taskPrio: string) {
    switch (taskPrio) {
      case 'low':
        return 'low';

      case 'medium':
        return 'medium';

      case 'urgent':
        return 'urgent';

      default:
        return 'medium';
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
        return '#FFA800';
    }
  }

  openEditTask(){
    this.editTaskOpened = true;
  }

  handleChecked(i:number, event: any){
    event.stopPropagation();
    this.clickedTask.subtasks[i].checked = !this.clickedTask.subtasks[i].checked;
    this.allTasks[this.taskIndex] = this.clickedTask;
    this.firestoreService.updateUserTasks(this.allTasks);
  }

  deleteTask() {
    this.allTasks.splice(this.taskIndex, 1);
    this.firestoreService.updateUserTasks(this.allTasks);
    this.closeTaskDetail();
  }

}

