import { Injectable } from '@angular/core';
import { Player } from '../shared/player';
import { PLAYERS } from '../shared/players';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  loggedPlayer: BehaviorSubject<string>;

  constructor(private http: HttpClient, private processHttpMsgService: ProcessHTTPMsgService, private configService: ConfigService) { 
    this.loggedPlayer = new BehaviorSubject("-");
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.configService.baseURL + "players").pipe(catchError(this.processHttpMsgService.handleError));
  }

  getPlayer(firstname: string): Observable<Player> {
    return this.http.get<Player>(this.configService.baseURL + "players/" + firstname).pipe(catchError(this.processHttpMsgService.handleError));
  }

  setLoggedPlayer(player: string) {
    console.log("Service: ",  player);
    this.loggedPlayer.next(player);
  }

  getLoggedPlayer(): BehaviorSubject<string> {
    return this.loggedPlayer;
  }
}
