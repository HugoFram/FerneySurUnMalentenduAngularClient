import { Injectable } from '@angular/core';
import { PresenceList } from '../shared/presenceList';
import { PresenceTrainingDbFormat } from '../shared/presenceTrainingDbFormat';
import { PresenceMatchDbFormat } from '../shared/presenceMatchDbFormat';
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

  getTrainingPresences(): Observable<PresenceTrainingDbFormat[]> {
    return this.http.get<PresenceTrainingDbFormat[]>(baseURL + "trainings").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatchPresences(): Observable<PresenceMatchDbFormat[]> {
    return this.http.get<PresenceMatchDbFormat[]>(baseURL + "matches").pipe(catchError(this.processHttpMsgService.handleError));
  } 
}
