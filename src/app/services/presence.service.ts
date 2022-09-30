import { Injectable } from '@angular/core';
import { PresenceList } from '../shared/presenceList';
import { PresenceTrainingDbFormat } from '../shared/presenceTrainingDbFormat';
import { PresenceTrainingsFormat } from '../shared/presenceTrainingsFormat';
import { PresenceMatchDbFormat } from '../shared/presenceMatchDbFormat';
import { TRAINING_PRESENCE } from '../shared/trainingPresences';
import { MATCH_PRESENCE } from '../shared/matchPresences';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService, private configService: ConfigService) { }

  getTrainingPresences(): Observable<PresenceTrainingsFormat> {
    return this.http.get<PresenceTrainingsFormat>(this.configService.baseURL + "training-presences").pipe(catchError(this.processHttpMsgService.handleError));
  }

  postTrainingPresences(presences: PresenceTrainingDbFormat[], trainingDate: string): Observable<PresenceTrainingDbFormat[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<PresenceTrainingDbFormat[]>(this.configService.baseURL + "training-presences/" + trainingDate, presences, httpOptions).pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteTrainingPresences(trainingDate: string): Observable<{}> {
    return this.http.delete(this.configService.baseURL + "training-presences/" + trainingDate).pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatchPresences(): Observable<PresenceMatchDbFormat[]> {
    return this.http.get<PresenceMatchDbFormat[]>(this.configService.baseURL + "match-presences").pipe(catchError(this.processHttpMsgService.handleError));
  }

  postMatchPresences(presences: PresenceMatchDbFormat[], matchDate: string): Observable<PresenceMatchDbFormat[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<PresenceMatchDbFormat[]>(this.configService.baseURL + "match-presences/" + matchDate, presences, httpOptions).pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteMatchPresences(matchDate: string): Observable<{}> {
    return this.http.delete(this.configService.baseURL + "match-presences/" + matchDate).pipe(catchError(this.processHttpMsgService.handleError));
  }
}
