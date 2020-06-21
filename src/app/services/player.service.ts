import { Injectable } from '@angular/core';
import { Player } from '../shared/player';
import { PLAYERS } from '../shared/players';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  loggedPlayer: BehaviorSubject<string>;

  constructor() { 
    this.loggedPlayer = new BehaviorSubject("-");
  }

  getPlayers(): Player[] {
    return PLAYERS;
  }

  getPlayer(firstname: string): Player {
    return PLAYERS.filter(player => player.firstname === firstname)[0];
  }

  setLoggedPlayer(player: string) {
    console.log("Service: ",  player);
    this.loggedPlayer.next(player);
  }

  getLoggedPlayer(): BehaviorSubject<string> {
    return this.loggedPlayer;
  }
}
