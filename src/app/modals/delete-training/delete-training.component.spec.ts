import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTrainingComponent } from './delete-training.component';

describe('DeleteTrainingComponent', () => {
  let component: DeleteTrainingComponent;
  let fixture: ComponentFixture<DeleteTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
