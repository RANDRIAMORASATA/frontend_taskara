import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskUrgentComponent } from './urgent-task.component';

describe('DetailtaskComponent', () => {
  let component: TaskUrgentComponent;
  let fixture: ComponentFixture<TaskUrgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskUrgentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskUrgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
