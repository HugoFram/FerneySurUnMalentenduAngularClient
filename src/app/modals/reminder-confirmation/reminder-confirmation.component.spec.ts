import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderConfirmationComponent } from './reminder-confirmation.component';

describe('ReminderConfirmationComponent', () => {
  let component: ReminderConfirmationComponent;
  let fixture: ComponentFixture<ReminderConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
