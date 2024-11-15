import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAcceuilComponent } from './dashboard-acceuil.component';

describe('DashboardAcceuilComponent', () => {
  let component: DashboardAcceuilComponent;
  let fixture: ComponentFixture<DashboardAcceuilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardAcceuilComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAcceuilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
