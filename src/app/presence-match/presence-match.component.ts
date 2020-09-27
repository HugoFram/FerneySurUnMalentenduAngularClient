import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import * as moment from 'moment';

import { AddMatchComponent } from '../modals/add-match/add-match.component';
import { DeleteMatchComponent } from '../modals/delete-match/delete-match.component';
import { PresenceList } from '../shared/presenceList';
import { Presence } from '../shared/presence';
import { PresenceMatchDbFormat } from '../shared/presenceMatchDbFormat';
import { Player } from '../shared/player';
import { PresenceService } from '../services/presence.service';
import { PlayerService } from '../services/player.service';
import { MatchAvailabilityService } from '../services/match-availability.service';

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
  players: Player[];

  constructor(private presenceService: PresenceService, private playerService: PlayerService, private matchAvailabilityService: MatchAvailabilityService, private dialog: MatDialog, private datePipe: DatePipe) { }

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

      this.playerService.getPlayers().subscribe(players => this.players = players);
    });
  }

  openAddMatchModal() {
    const dialogRef = this.dialog.open(AddMatchComponent, {data: {currentPresence: this.matchPresences, players: this.players}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        let label = result.data.opponent + "<br>" + result.data.date.toLocaleDateString() + "<br>" + "(" + result.data.setsWon + "-" + result.data.setsLost + ")";
        let index = this.matchPresences.labels.findIndex(lab => lab === label);
        let presencesDB = new Array<PresenceMatchDbFormat>();
        if (index != -1) {
          this.matchPresences.labels.splice(index, 1, label);
          this.matchPresences.presences.forEach((presence, i) => {
            presence.presenceTypes.splice(index, 1,result.data.presenceWithoutPlayingList[i] ? "Présent sans jouer" : (result.data.presenceList[i] ? "Présent" : "Absent"));
            presencesDB.push({
              name: presence.player,
              date: this.datePipe.transform(result.data.date, 'yyyy-MM-dd'),
              presence: result.data.presenceWithoutPlayingList[i] ? "Présent sans jouer" : (result.data.presenceList[i] ? "Présent" : "Absent"),
              adversary: result.data.opponent,
              setsWon: result.data.setsWon,
              setsLost: result.data.setsLost
            });
          });
        } else {
          this.matchPresences.labels.push(label);
          if (this.matchPresences.presences.length == 0) {
            this.players.forEach((player, i) => {
              this.matchPresences.presences.push({
                player: player.firstname,
                presenceTypes: [result.data.presenceWithoutPlayingList[i] ? "Présent sans jouer" : (result.data.presenceList[i] ? "Présent" : "Absent")]
              });
              presencesDB.push({
                name: player.firstname,
                date: this.datePipe.transform(result.data.date, 'yyyy-MM-dd'),
                presence: result.data.presenceWithoutPlayingList[i] ? "Présent sans jouer" : (result.data.presenceList[i] ? "Présent" : "Absent"),
                adversary: result.data.opponent,
                setsWon: result.data.setsWon,
                setsLost: result.data.setsLost
              });
            })
          } else {
            this.matchPresences.presences.forEach((presence, i) => {
              presence.presenceTypes.push(result.data.presenceWithoutPlayingList[i] ? "Présent sans jouer" : (result.data.presenceList[i] ? "Présent" : "Absent"));
              presencesDB.push({
                name: presence.player,
                date: this.datePipe.transform(result.data.date, 'yyyy-MM-dd'),
                presence: result.data.presenceWithoutPlayingList[i] ? "Présent sans jouer" : (result.data.presenceList[i] ? "Présent" : "Absent"),
                adversary: result.data.opponent,
                setsWon: result.data.setsWon,
                setsLost: result.data.setsLost
              });
            });
          }
        }

        this.presenceService.postMatchPresences(presencesDB, this.datePipe.transform(result.data.date, 'yyyy-MM-dd')).subscribe(result => {
          this.updateMatchPresenceStatistics();
        });
      }
    });

  }

  openDeleteMatchModal() {
    const dialogRef = this.dialog.open(DeleteMatchComponent, {data: {existingMatches: this.matchPresences.labels}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data !== null) {
        let index = result.data;
        let label = this.matchPresences.labels[index];
        let matchDate = moment(this.matchPresences.labels[index].slice(label.length - 19, label.length - 9), "DD/MM/YYYY").format("YYYY-MM-DD");
        this.presenceService.deleteMatchPresences(matchDate).subscribe();
        this.matchPresences.labels.splice(index, 1);
        this.matchPresences.presences.forEach(presence => presence.presenceTypes.splice(index, 1));

        this.updateMatchPresenceStatistics();
      }
    });
  }

  updateMatchPresenceStatistics() {
    // Load all match availabilities to update match presence statistics
    this.matchAvailabilityService.getMatchAvailabilities().subscribe(availabilities => {
      // Load all match presences to compute match presence statistics and get unique match dates
      this.presenceService.getMatchPresences().subscribe(matchPresencesDB => {
        availabilities.forEach(availability => {
          let numMatches = matchPresencesDB.filter(presence => presence.name == availability.name).length;
          let numPresence = matchPresencesDB.filter(presence => presence.name == availability.name).map(presence => presence.presence == "Présent" ? 1 : 0).reduce((acc, val) => acc += val, 0);
          availability.matchPresence = Math.round(100.0*numPresence / numMatches) + " % (" + numPresence + "/" + numMatches + ")";
        });
        let matchNums = availabilities.filter(
          (availability, i, _availabilities) => _availabilities.findIndex(_availability => _availability.matchNum === availability.matchNum) === i
        ).map(availability => availability.matchNum);
        matchNums.forEach(matchNum => this.matchAvailabilityService.postMatchAvailabilities(matchNum, availabilities.filter(availability => availability.matchNum == matchNum)).subscribe());
      });
    });
  }

}
