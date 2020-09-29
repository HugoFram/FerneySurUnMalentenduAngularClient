import { Injectable } from '@angular/core';
import { Rank } from '../shared/rank';
import { RANKS } from '../shared/ranks';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class RankService {

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService, private configService: ConfigService) { }

  getRanks(): Observable<Rank[]> {
    return this.http.get<Rank[]>(this.configService.baseURL + "ranking").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getRank(rank: number): Rank {
    return RANKS.filter(_rank => _rank.rank === rank)[0];
  }
}
