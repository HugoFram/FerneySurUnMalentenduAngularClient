import { Injectable } from '@angular/core';
import { PresenceList } from '../shared/presenceList';
import { TRAINING_PRESENCE } from '../shared/trainingPresences';
import { MATCH_PRESENCE } from '../shared/matchPresences';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor() { }

  getTrainingPresences(): PresenceList {
    return TRAINING_PRESENCE;
  }

  getMatchPresences(): PresenceList {
    return MATCH_PRESENCE;
  } 
}
