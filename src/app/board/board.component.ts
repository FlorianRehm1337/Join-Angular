import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FirestoreService } from '../shared/services/firestore.service';
import { AuthService } from '../shared/services/auth.service';
import { Observable } from 'rxjs';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { getAuth } from 'firebase/auth';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  allTasks$: Observable<any[]> | undefined
  allTasks: any[] = [];

  tasksTodo: any[] = [];
  tasksInProgress: any[] = [];
  tasksAwaitingFeedback: any[] = [];
  tasksDone: any[] = [];
  searchInput: string = '';
  showTaskDetail: boolean = false; //false by default
  isDesktopView: boolean = false;
  windowWidth: number = window.innerWidth;
  detailTask: any;

  app = initializeApp(environment.firebase);
  auth = getAuth(this.app);
  db = getFirestore(this.app);

  constructor(public firestoreService: FirestoreService, public authService: AuthService) {

    setTimeout(() => {
      const unsub = onSnapshot(doc(this.db, "Users", this.firestoreService.currentUserDocID), (doc) => {
        if (doc.exists()) {
          this.allTasks = this.firestoreService.currentUserData.allTasks;
          this.filterTasks();
        }
      });
    }, 1000)


  }

  getUserID(){
    this.authService.checkAuthState();
    this.firestoreService.getCurrentuser();

    let id = this.firestoreService.currentUserDocID;
    return id
  }

  @HostListener('window:resize') onResize() {

    this.windowWidth = window.innerWidth;
    if (this.windowWidth > 1000) {
      this.isDesktopView = true;
    } else {
      this.isDesktopView = false;
    }
  }

  async ngOnInit() {
    await this.authService.checkAuthState();
    await this.firestoreService.getCurrentuser();
    debugger;
    this.allTasks = this.firestoreService.currentUserData.allTasks;
    this.filterTasks();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.changeTaskStatus(event)
    }
  }

  calculateCheckedSubtasks(i: number, array: Array<any>) {
    return array[i].subtasks.filter((subtask: { checked: any; }) => subtask.checked).length;
  }

  calculateProgress(i: number, array: Array<any>) {
    let checkedSubtasks = this.calculateCheckedSubtasks(i, array);
    return ((100 * checkedSubtasks) / array[i].subtasks.length);
  }

  checkPriority(i: number, array: Array<any>) {

    if (array[i].priority == 'low') {
      return 'assets/img/prio-low.svg'
    } else if (array[i].priority == 'urgent') {
      return 'assets/img/prio-urgent.svg'
    } else {
      return 'assets/img/prio-medium.svg'
    }
  }

  changeTaskStatus(event: any) {
    let currentIndex = event.currentIndex;
    if (event.container.id == 'dropList0') {
      this.tasksTodo[currentIndex].status = 'todo';
    } else if (event.container.id == 'dropList1') {
      this.tasksInProgress[currentIndex].status = 'in-progress';
    } else if (event.container.id == 'dropList2') {
      this.tasksAwaitingFeedback[currentIndex].status = 'awaiting-feedback';
    } else if (event.container.id == 'dropList3') {
      this.tasksDone[currentIndex].status = 'done';
    }
    this.firestoreService.updateUserTasks(this.allTasks);
  }

  filterTasks() {
    this.tasksTodo = this.allTasks.filter(task => task.status == 'todo');
    this.tasksInProgress = this.allTasks.filter(task => task.status == 'in-progress');
    this.tasksAwaitingFeedback = this.allTasks.filter(task => task.status == 'awaiting-feedback');
    this.tasksDone = this.allTasks.filter(task => task.status == 'done');
  }

  checkMatchWithSearch(task: any) {
    return task.title.toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase()) ||
      task.category.name.toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase()) ||
      task.description.toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase()) ||
      task.priority.toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase())
  }

  openDetailTask(i: number, array: Array<any>) {
    this.showTaskDetail = true;
    this.detailTask = array[i];
  }
}
