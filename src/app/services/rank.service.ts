import { Injectable } from '@angular/core';
import { Rank } from '../shared/rank';
import { RANKS } from '../shared/ranks';

@Injectable({
  providedIn: 'root'
})
export class RankService {

  constructor() { }

  getRanks(): Rank[] {
    return RANKS;
  }

  getRank(rank: number): Rank {
    return RANKS.filter(_rank => _rank.rank === rank)[0];
  }
}
