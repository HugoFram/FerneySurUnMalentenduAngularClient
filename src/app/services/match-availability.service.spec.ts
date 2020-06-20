import { TestBed } from '@angular/core/testing';

import { MatchAvailabilityService } from './match-availability.service';

describe('MatchAvailabilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatchAvailabilityService = TestBed.get(MatchAvailabilityService);
    expect(service).toBeTruthy();
  });
});
