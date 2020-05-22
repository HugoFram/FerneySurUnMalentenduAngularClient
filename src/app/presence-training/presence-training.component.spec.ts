import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceTrainingComponent } from './presence-training.component';

describe('PresenceTrainingComponent', () => {
  let component: PresenceTrainingComponent;
  let fixture: ComponentFixture<PresenceTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresenceTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
