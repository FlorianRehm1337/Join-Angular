import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  allTasks: any[] = [];
  tasksTodo: any[] = [];
  tasksInProgress: any[] = [];
  tasksAwaitingFeedback: any[] = [];
  tasksDone: any[] = [];
  urgentTasks: any[] = [];
  createdTask: boolean = false;

  constructor(public firestoreService: FirestoreService, public authService: AuthService,) {
  }

  getAllTasks() {
    this.allTasks = this.firestoreService.currentUserData.allTasks;
  }

  filterTasks() {
    this.tasksTodo = this.allTasks.filter(task => task.status == 'todo');
    this.tasksInProgress = this.allTasks.filter(task => task.status == 'in-progress');
    this.tasksAwaitingFeedback = this.allTasks.filter(task => task.status == 'awaiting-feedback');
    this.tasksDone = this.allTasks.filter(task => task.status == 'done');
    this.urgentTasks = this.allTasks.filter(task => task.priority == 'urgent');
  }
}
