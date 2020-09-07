import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';

import { AddMatchComponent } from '../modals/add-match/add-match.component';
import { DeleteMatchComponent } from '../modals/delete-match/delete-match.component';
import { PresenceList } from '../shared/presenceList';
import { Presence } from '../shared/presence';
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
    this.presenceService.getMatchPresences().subscribe(presencesDB => {
      this.matchPresences = new PresenceList();
      // Count number of distinct dates (= num trainings) in the DB table
      let numMatches = Object.keys(presencesDB.reduce((acc, presenceDB) => {
        acc[presenceDB.date] = acc[presenceDB.date] ? acc[presenceDB.date] + 1 : 1;
        return acc;
      }, Object.create(null))).length; 
      // Create a presence entry (= player + list of presenceTypes) for each player from the DB table
      this.matchPresences.presences = Object.keys(presencesDB.reduce((acc, presenceDB) => {
        acc[presenceDB.name] = acc[presenceDB.name] ? acc[presenceDB.name] + 1 : 1;
        return acc;
      }, Object.create(null))).map(key => {
        let presence = new Presence();
        presence = {player: key, presenceTypes: Array<string>(numMatches)};
        return presence;
      });
      this.matchPresences.labels = new Array<string>(); 

      presencesDB.forEach(presenceDB => {
        // Find index of the presence entry that corresponds to the player from the DB table entry
        let indexPlayer = this.matchPresences.presences.findIndex(presence => presence.player == presenceDB.name);
        let indexMatch = this.matchPresences.labels.findIndex(label => label.includes(new Date(presenceDB.date).toLocaleDateString()));
        if (indexMatch == -1) {
        // If the training is not loaded yet
          // Create a label for the training and add it to the list of training labels
          this.matchPresences.labels.push(presenceDB.adversary + "<br>" + new Date(presenceDB.date).toLocaleDateString() + "<br>" + "(" + presenceDB.setsWon + "-" + presenceDB.setsLost + ")");

          // The index of the training is the number of training already loaded (0-based indexing)
          indexMatch = this.matchPresences.labels.length - 1;
        }

        // Set the presence type for this player and this training
        this.matchPresences.presences[indexPlayer].presenceTypes[indexMatch] = presenceDB.presence;
      });
    });
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
