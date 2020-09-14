import { Injectable } from '@angular/core';
import { Rank } from '../shared/rank';
import { RANKS } from '../shared/ranks';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class RankService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService) { }

  getRanks(): Observable<Rank[]> {
    return this.http.get<Rank[]>(baseURL + "ranking").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getRank(rank: number): Rank {
    return RANKS.filter(_rank => _rank.rank === rank)[0];
  }
}
