import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { FirestoreService } from '../shared/services/firestore.service';
import { TaskService } from '../shared/services/task.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  currentTime: any = new Date().getHours();
  dataFromUser: any;

  constructor(public firestoreService: FirestoreService, public authService: AuthService, public taskService: TaskService) { }

  async ngOnInit() {
    await this.authService.checkAuthState();
    await this.firestoreService.getCurrentuser();
    this.dataFromUser = this.firestoreService.currentUserData;
    this.taskService.getAllTasks();
    this.taskService.filterTasks();

    console.log(this.taskService.urgentTasks);
    this.sortUrgentTasks();
    console.log(this.taskService.allTasks);
    console.log(this.taskService.tasksTodo);
    console.log('sorted', this.taskService.urgentTasks);
  }

  checkCurrentTime() {

    switch (true) {

      case this.currentTime < 4:
        return 'Good night';

      case this.currentTime < 12:
        return 'Good morning';

      case this.currentTime > 18:
        return 'Good evening';

      case this.currentTime >= 12:
        return 'Good afternoon';

      default:
        return '';
    }
  }

  sortUrgentTasks() {
    this.taskService.urgentTasks.sort(function (a, b) {
      let c: any = new Date(a.date);
      let d: any = new Date(b.date);
      return c - d;
    })
  }

}
