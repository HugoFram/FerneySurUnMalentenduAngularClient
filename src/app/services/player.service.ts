import { Injectable } from '@angular/core';
import { Player } from '../shared/player';
import { PLAYERS } from '../shared/players';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor() { }

  getPlayers(): Player[] {
    return PLAYERS;
  }

  getPlayer(firstname: string): Player {
    return PLAYERS.filter(player => player.firstname === firstname)[0];
  }
}
