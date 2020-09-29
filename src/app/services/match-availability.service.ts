import { Injectable } from '@angular/core';
import { MatchAvailability } from '../shared/matchAvailability';
import { AvailabilityDbFormat } from '../shared/availabilityDbFormat';
import { PastMatchAvailability } from '../shared/pastMatchAvailability';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MatchAvailabilityService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService, private configService: ConfigService) { }

  getMatchAvailabilities(): Observable<AvailabilityDbFormat[]> {
    return this.http.get<AvailabilityDbFormat[]>(this.configService.baseURL + "availabilities").pipe(catchError(this.processHttpMsgService.handleError));
  }

  postMatchAvailabilities(matchNum: string, availabilities: AvailabilityDbFormat[]): Observable<AvailabilityDbFormat[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<AvailabilityDbFormat[]>(this.configService.baseURL + "availabilities/" + matchNum, availabilities, httpOptions).pipe(catchError(this.processHttpMsgService.handleError));
  }

  postMatchAvailability(matchNum: string, playerName: string, availability: AvailabilityDbFormat): Observable<AvailabilityDbFormat> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<AvailabilityDbFormat>(this.configService.baseURL + "availabilities/" + matchNum + "/" + playerName, availability, httpOptions).pipe(catchError(this.processHttpMsgService.handleError));
  }

  getPastMatchAvailabilities(): Observable<PastMatchAvailability[]> {
    return this.http.get<PastMatchAvailability[]>(this.configService.baseURL + "past-availabilities").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getPlayerPastMatchAvailability(playerName: string): Observable<PastMatchAvailability> {
    return this.http.get<PastMatchAvailability>(this.configService.baseURL + "past-availabilities/" + playerName).pipe(catchError(this.processHttpMsgService.handleError));
  }
}
