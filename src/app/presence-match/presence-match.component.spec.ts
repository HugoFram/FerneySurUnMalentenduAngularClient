import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceMatchComponent } from './presence-match.component';

describe('PresenceMatchComponent', () => {
  let component: PresenceMatchComponent;
  let fixture: ComponentFixture<PresenceMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresenceMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresenceMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
