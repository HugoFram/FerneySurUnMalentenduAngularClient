import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Match } from '../shared/match';

import { MatchService } from '../services/match.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  displayedColumns: string[] = ['id', 'home', 'visitor', 'date', 'hour', 'place'];
  calendar: Match[];
  calendarTableData: MatTableDataSource<Match>;
  errMess: string;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private matchService: MatchService) {}

  ngOnInit() {
    this.matchService.getMatches().subscribe(matches => {
      this.calendar = matches.map(match => {
        match.date = new Date(match.date);
        return match;
      });
      this.calendarTableData = new MatTableDataSource<Match>(this.calendar);
      this.calendarTableData.sort = this.sort;
    }, errmess => this.errMess = <any>errmess);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.calendarTableData.filter = filterValue.trim().toLowerCase();
  }

}

