import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import * as moment from 'moment';

import { AddTrainingComponent } from '../modals/add-training/add-training.component';
import { DeleteTrainingComponent } from '../modals/delete-training/delete-training.component';
import { PresenceList } from '../shared/presenceList';
import { Presence } from '../shared/presence';
import { PresenceTrainingDbFormat } from '../shared/presenceTrainingDbFormat';
import { Player } from '../shared/player';
import { PresenceService } from '../services/presence.service';
import { PlayerService } from '../services/player.service';
import { isNull } from 'util';
import { MatchAvailabilityService } from '../services/match-availability.service';

export class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
      if (displayFormat === 'input') {
          return formatDate(date,'dd-MMM-yyyy',this.locale);;
      } else {
          return date.toDateString();
      }
  }
}

@Component({
  selector: 'app-presence-training',
  templateUrl: './presence-training.component.html',
  styleUrls: ['./presence-training.component.scss'],
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
export class PresenceTrainingComponent implements OnInit {

  trainingPresences: PresenceList;
  players: Player[];

  constructor(private presenceService: PresenceService, private playerService: PlayerService, private matchAvailabilityService: MatchAvailabilityService, private dialog: MatDialog, private datePipe: DatePipe) { }

  ngOnInit() {
    this.presenceService.getTrainingPresences().subscribe(presencesDB => {
      this.trainingPresences = new PresenceList();
      // Count number of distinct dates (= num trainings) in the DB table
      let numTrainings = Object.keys(presencesDB.reduce((acc, presenceDB) => {
        acc[presenceDB.date] = acc[presenceDB.date] ? acc[presenceDB.date] + 1 : 1;
        return acc;
      }, Object.create(null))).length; 
      // Create a presence entry (= player + list of presenceTypes) for each player from the DB table
      this.trainingPresences.presences = Object.keys(presencesDB.reduce((acc, presenceDB) => {
        acc[presenceDB.name] = acc[presenceDB.name] ? acc[presenceDB.name] + 1 : 1;
        return acc;
      }, Object.create(null))).map(key => {
        let presence = new Presence();
        presence = {player: key, presenceTypes: Array<string>(numTrainings)};
        return presence;
      });
      this.trainingPresences.labels = new Array<string>(); 

      presencesDB.forEach(presenceDB => {
        // Find index of the presence entry that corresponds to the player from the DB table entry
        let indexPlayer = this.trainingPresences.presences.findIndex(presence => presence.player == presenceDB.name);
        let indexTraining = this.trainingPresences.labels.findIndex(label => label.includes(new Date(presenceDB.date).toLocaleDateString()));
        if (indexTraining == -1) {
        // If the training is not loaded yet
          // Create a label for the training and add it to the list of training labels
          this.trainingPresences.labels.push(new Date(presenceDB.date).toLocaleDateString() + " (" + (presenceDB.presence == "Présent" ? "1" : "0") + ")");

          // The index of the training is the number of training already loaded (0-based indexing)
          indexTraining = this.trainingPresences.labels.length - 1;
        } else {
          let numPresent = Number(this.trainingPresences.labels[indexTraining].match(/[(]([0-9]+)[)]/)[1]) + (presenceDB.presence == "Présent" ? 1 : 0);
          this.trainingPresences.labels[indexTraining] = this.trainingPresences.labels[indexTraining].slice(0, 10) + " (" + numPresent + ")";
        }

        // Set the presence type for this player and this training
        this.trainingPresences.presences[indexPlayer].presenceTypes[indexTraining] = presenceDB.presence;
      });

      this.playerService.getPlayers().subscribe(players => this.players = players);
    });
  }

  openAddTrainingModal() {
    const dialogRef = this.dialog.open(AddTrainingComponent, {data: {currentPresence: this.trainingPresences, players: this.players}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        let label = result.data.date.toLocaleDateString() + " (" + result.data.presenceList.reduce((acc, cur) => acc + cur, 0) + ")";
        let index = this.trainingPresences.labels.findIndex(lab => lab.slice(0, 10) === label.slice(0, 10));
        let presencesDB = new Array<PresenceTrainingDbFormat>();
        if (index != -1) {
          this.trainingPresences.labels.splice(index, 1, label);
          this.trainingPresences.presences.forEach((presence, i) => {
            presence.presenceTypes.splice(index, 1, result.data.presenceList[i] ? "Présent" : "Absent");
            presencesDB.push({
              name: presence.player,
              date: this.datePipe.transform(result.data.date, 'yyyy-MM-dd'),
              presence: result.data.presenceList[i] ? "Présent" : "Absent"
            });
          });
        } else {
          this.trainingPresences.labels.push(label);
          this.trainingPresences.presences.forEach((presence, i) => {
            presence.presenceTypes.push(result.data.presenceList[i] ? "Présent" : "Absent");
            presencesDB.push({
              name: presence.player,
              date: this.datePipe.transform(result.data.date, 'yyyy-MM-dd'),
              presence: result.data.presenceList[i] ? "Présent" : "Absent"
            });
          });
        }

        this.presenceService.postTrainingPresences(presencesDB, this.datePipe.transform(result.data.date, 'yyyy-MM-dd')).subscribe(result => {
          this.updateTrainingPresenceStatistics();
        });
      }
    });

  }

  openDeleteTrainingModal() {
    const dialogRef = this.dialog.open(DeleteTrainingComponent, {data: {existingTrainings: this.trainingPresences.labels}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data !== null) {
        let index = result.data;
        let trainingDate = moment(this.trainingPresences.labels[index].slice(0, 10), "DD/MM/YYYY").format("YYYY-MM-DD");
        this.presenceService.deleteTrainingPresences(trainingDate).subscribe();
        this.trainingPresences.labels.splice(index, 1);
        this.trainingPresences.presences.forEach(presence => presence.presenceTypes.splice(index, 1));

        this.updateTrainingPresenceStatistics();
      }
    });
  }

  updateTrainingPresenceStatistics() {
    // Load all match availabilities to update match presence statistics
    this.matchAvailabilityService.getMatchAvailabilities().subscribe(availabilities => {
      // Load all training presences to compute training presence statistics
      this.presenceService.getTrainingPresences().subscribe(trainingPresencesDB => {
        availabilities.forEach(availability => {
          let numTrainings = trainingPresencesDB.filter(presence => presence.name == availability.name).length;
          let numPresence = trainingPresencesDB.filter(presence => presence.name == availability.name)
                                               .map(presence => presence.presence == "Présent" ? 1 : 0).reduce((acc, val) => acc += val, 0);
          availability.trainingPresence = Math.round(100.0*numPresence / numTrainings) + " % (" + numPresence + "/" + numTrainings + ")";
        });
        let matchNums = availabilities.filter(
          (availability, i, _availabilities) => _availabilities.findIndex(_availability => _availability.matchNum === availability.matchNum) === i
        ).map(availability => availability.matchNum);
        matchNums.forEach(matchNum => this.matchAvailabilityService.postMatchAvailabilities(matchNum, availabilities.filter(availability => availability.matchNum == matchNum)).subscribe());
      });
    });
  }

}
