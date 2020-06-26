import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';

import { AddMatchComponent } from '../modals/add-match/add-match.component';
import { DeleteMatchComponent } from '../modals/delete-match/delete-match.component';
import { PresenceList } from '../shared/presenceList';
import { PresenceService } from '../services/presence.service';

class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);;
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-presence-match',
  templateUrl: './presence-match.component.html',
  styleUrls: ['./presence-match.component.scss'],
  providers: [
    {
      provide: MAT_DATE_FORMATS, useValue: {
        parse: {dateInput: {month: 'short', year: 'numeric', day: 'numeric'}},
        display: {
            dateInput: 'input',
            monthYearLabel: {year: 'numeric', month: 'short'},
            dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
            monthYearA11yLabel: {year: 'numeric', month: 'long'}
        }
      }
    },
    {provide: DateAdapter, useClass: PickDateAdapter}
  ]
})
export class PresenceMatchComponent implements OnInit {

  matchPresences: PresenceList;

  constructor(private presenceService: PresenceService, private dialog: MatDialog) { }

  ngOnInit() {
    this.matchPresences = this.presenceService.getMatchPresences();
  }

  openAddMatchModal() {
    const dialogRef = this.dialog.open(AddMatchComponent, {data: {currentPresence: this.matchPresences}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        let label = result.data.opponent + "<br>" + result.data.date.toLocaleDateString() + "<br>" + "(" + result.data.setsWon + "-" + result.data.setsLost + ")";
        let index = this.matchPresences.labels.findIndex(lab => lab === label);
        if (index != -1) {
          this.matchPresences.labels.splice(index, 1, label);
          this.matchPresences.presences.forEach((presence, i) => presence.presenceTypes.splice(index, 1,result.data.presenceWithoutPlayingList[i] ? "Présent sans jouer" : (result.data.presenceList[i] ? "Présent" : "Absent")));
        } else {
          this.matchPresences.labels.push(label);
          this.matchPresences.presences.forEach((presence, i) => presence.presenceTypes.push(result.data.presenceWithoutPlayingList[i] ? "Présent sans jouer" : (result.data.presenceList[i] ? "Présent" : "Absent")));
        }
      }
    });

  }

  openDeleteMatchModal() {
    const dialogRef = this.dialog.open(DeleteMatchComponent, {data: {existingMatches: this.matchPresences.labels}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        let index = result.data;
        this.matchPresences.labels.splice(index, 1);
        this.matchPresences.presences.forEach(presence => presence.presenceTypes.splice(index, 1));
      }
    });
  }

}
