import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Match } from '../shared/match';

import { MatchService } from '../services/match.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  displayedColumns: string[] = ['date', 'home', 'visitor', 'sets', 'setPoints', 'totalPointsHome', 'totalPointsVisitor'];
  results: Match[];
  resultsTableData: MatTableDataSource<Match>;
  errMess: string;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private matchService: MatchService) {}

  ngOnInit() {
    this.matchService.getMatches().subscribe(matches => {
      this.results = matches.map(match => {
        match.date = new Date(match.date);
        return match;
      });
      this.resultsTableData = new MatTableDataSource(this.results);
      this.resultsTableData.sort = this.sort;
    }, errmess => this.errMess = <any>errmess);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.resultsTableData.filter = filterValue.trim().toLowerCase();
  }

}
