import { Component, OnInit } from '@angular/core';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';

import { Rank } from '../shared/rank';

import { RankService } from '../services/rank.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  ranks: Rank[];
  ranksTableData: Rank[];

  constructor(private rankService: RankService) { }

  ngOnInit() {
    this.ranks = this.rankService.getRanks();
    const data = this.ranks.slice();
    this.ranksTableData = data.sort((a, b) => {
      return compare(a.rank, b.rank, true);
    });
  }

}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
