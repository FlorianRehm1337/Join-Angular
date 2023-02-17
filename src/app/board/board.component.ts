import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FirestoreService } from '../shared/services/firestore.service';
import { AuthService } from '../shared/services/auth.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  allTasks: any[] = [];

  tasksTodo: any[] = [];
  tasksInProgress: any[] = [];
  tasksAwaitingFeedback: any[] = [];
  tasksDone: any[] = [];
  searchInput: string = '';

  constructor(public firestoreService: FirestoreService, public authService: AuthService) { }

  async ngOnInit() {
    await this.authService.checkAuthState();
    await this.firestoreService.getCurrentuser();
    this.allTasks = this.firestoreService.currentUserData.allTasks;
    this.filterTasks();
    console.log(this.allTasks);
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
    } else if (array[i].priority == 'medium') {
      return 'assets/img/prio-medium.svg'
    } else {
      return 'assets/img/prio-urgent.svg'
    }
  }

  changeTaskStatus(event: any) {
    let currentIndex = event.currentIndex;
    if (event.container.id == 'cdk-drop-list-0') {
      this.tasksTodo[currentIndex].status = 'todo';
    } else if (event.container.id == 'cdk-drop-list-1') {
      this.tasksInProgress[currentIndex].status = 'in-progress';
    } else if (event.container.id == 'cdk-drop-list-2') {
      this.tasksAwaitingFeedback[currentIndex].status = 'awaiting-feedback';
    } else {
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
}
