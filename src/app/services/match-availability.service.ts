import { Injectable } from '@angular/core';
import { MatchAvailability } from '../shared/matchAvailability';
import { AvailabilityDbFormat } from '../shared/availabilityDbFormat';
import { MATCH_AVAILABILITIES } from '../shared/matchAvailabilities';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class MatchAvailabilityService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService) { }

  getMatchAvailabilities(): Observable<AvailabilityDbFormat[]> {
    return this.http.get<AvailabilityDbFormat[]>(baseURL + "availabilities").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getMatchAvailability(matchNum: string): MatchAvailability {
    return MATCH_AVAILABILITIES.filter(matchAv => matchAv.matchNum === matchNum)[0];
  }
}
