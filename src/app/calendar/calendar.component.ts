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

  @ViewChild(MatSort) sort: MatSort;

  constructor(private matchService: MatchService) { 
    this.calendar = this.matchService.getMatches();
    this.calendarTableData = new MatTableDataSource(this.calendar);
  }

  ngOnInit() {
    this.calendarTableData.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.calendarTableData.filter = filterValue.trim().toLowerCase();
  }

}

