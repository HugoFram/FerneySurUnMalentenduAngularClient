import { Injectable } from '@angular/core';
import { Match } from '../shared/match';
import { MATCHES } from '../shared/matches';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService, private configService: ConfigService) { }

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.configService.baseURL + "matches").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatch(id: string): Match {
    return MATCHES.filter(match => match.id === id)[0];
  }

  getMatchSheets(): Observable<string[]> {
    return this.http.get<string[]>(this.configService.baseURL + "sheets").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatchSheet(id: string): Observable<any> {
    return this.http.get(this.configService.baseURL + "sheets/" + id, { responseType: 'blob'}).pipe(catchError(this.processHttpMsgService.handleError));
  }
}
