import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailEditComponent } from './task-detail-edit.component';

describe('TaskDetailEditComponent', () => {
  let component: TaskDetailEditComponent;
  let fixture: ComponentFixture<TaskDetailEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDetailEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
