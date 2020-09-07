import { Injectable } from '@angular/core';
import { PresenceList } from '../shared/presenceList';
import { PresenceDbFormat } from '../shared/presenceDbFormat';
import { TRAINING_PRESENCE } from '../shared/trainingPresences';
import { MATCH_PRESENCE } from '../shared/matchPresences';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService) { }

  getTrainingPresences(): Observable<PresenceDbFormat[]> {
    return this.http.get<PresenceDbFormat[]>(baseURL + "trainings").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatchPresences(): PresenceList {
    return MATCH_PRESENCE;
  } 
}
