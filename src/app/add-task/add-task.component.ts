import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
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

  currentSelection: string = '';
  categoriesOpened: boolean = false;
  asigneesOpened: boolean = false;
  newCategory: boolean = false;
  constructor(public router: Router) { }

  ngOnInit(): void {
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


