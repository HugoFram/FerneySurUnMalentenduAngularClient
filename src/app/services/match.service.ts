import { Injectable } from '@angular/core';
import { Match } from '../shared/match';
import { MATCHES } from '../shared/matches';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService) { }

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(baseURL + "matches").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatch(id: string): Match {
    return MATCHES.filter(match => match.id === id)[0];
  }
}
