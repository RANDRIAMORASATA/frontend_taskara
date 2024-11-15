import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksUrgentComponent } from './urgent-tasks.component';

describe('DetailtaskComponent', () => {
  let component: TasksUrgentComponent;
  let fixture: ComponentFixture<TasksUrgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TasksUrgentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TasksUrgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
