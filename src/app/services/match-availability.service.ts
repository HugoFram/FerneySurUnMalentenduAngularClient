import { Injectable } from '@angular/core';
import { MatchAvailability } from '../shared/matchAvailability';
import { MATCH_AVAILABILITIES } from '../shared/matchAvailabilities';

@Injectable({
  providedIn: 'root'
})
export class MatchAvailabilityService {

  constructor() { }

  getMatchAvailabilities(): MatchAvailability[] {
    return MATCH_AVAILABILITIES;
  }

  getMatchAvailability(matchNum: string): MatchAvailability {
    return MATCH_AVAILABILITIES.filter(matchAv => matchAv.matchNum === matchNum)[0];
  }
}
