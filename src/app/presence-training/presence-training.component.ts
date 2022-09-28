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
import { PresenceTrainingsFormat } from '../shared/presenceTrainingsFormat';
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

  trainingPresences: PresenceTrainingsFormat;
  players: Player[];

  constructor(private presenceService: PresenceService, private playerService: PlayerService, private matchAvailabilityService: MatchAvailabilityService, private dialog: MatDialog, private datePipe: DatePipe) { }

  ngOnInit() {
    this.presenceService.getTrainingPresences().subscribe(presences => {
      this.trainingPresences = presences;
      this.playerService.getPlayers().subscribe(players => this.players = players.sort((playerA, playerB) => playerA.firstname.localeCompare(playerB.firstname)));
    });
  }

  openAddTrainingModal() {
    const dialogRef = this.dialog.open(AddTrainingComponent, {data: {currentPresence: this.trainingPresences, players: this.players}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {

        let label = result.data.date.toLocaleDateString() + " (" + result.data.presenceList.reduce((acc, cur) => acc + cur, 0) + ")";
        let index = this.trainingPresences.trainings.findIndex(training => training.label.slice(0, 10) === label.slice(0, 10));
        let presencesDB = new Array<PresenceTrainingDbFormat>();

        let numPresent = result.data.presenceList.reduce((acc, cur) => acc + cur, 0);
        let presences = {}

        // Add players that are not yet in the presence table
        this.players.forEach((player, playerId) => {
          if (this.trainingPresences.players.indexOf(player.firstname) == -1) {
            this.trainingPresences.players.push(player.firstname)
          }
          let presenceType = result.data.presenceList[playerId] ? "Présent" : "Absent"
          presences[player.firstname] = {
            name: player.firstname,
            presenceType: presenceType
          }
          presencesDB.push({
            name: player.firstname,
            date: this.datePipe.transform(result.data.date, 'yyyy-MM-dd'),
            presence: presenceType
          });
        });

        let newTraining = {
          date: this.datePipe.transform(result.data.date, 'yyyy-MM-dd'),
          label: result.data.date.toLocaleDateString() + " (" + numPresent + ")",
          presences: presences
        }

        if (index != -1) {
          this.trainingPresences.trainings.splice(index, 1, newTraining);
        } else {
          this.trainingPresences.trainings.push(newTraining);
        }

        this.trainingPresences.trainings.sort((trainingA, trainingB) => trainingA.date > trainingB.date ? 1 : -1);

        this.presenceService.postTrainingPresences(presencesDB, this.datePipe.transform(result.data.date, 'yyyy-MM-dd')).subscribe(result => {
          this.updateTrainingPresenceStatistics();
        });
      }
    });

  }

  openDeleteTrainingModal() {
    const dialogRef = this.dialog.open(DeleteTrainingComponent, {data: {existingTrainings: this.trainingPresences.trainings}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data !== null) {
        let index = result.data;
        let trainingDate = moment(this.trainingPresences.trainings[index].label.slice(0, 10), "DD/MM/YYYY").format("YYYY-MM-DD");
        this.presenceService.deleteTrainingPresences(trainingDate).subscribe();
        this.trainingPresences.trainings.splice(index, 1);

        this.updateTrainingPresenceStatistics();
      }
    });
  }

  updateTrainingPresenceStatistics() {
    // Load all match availabilities to update match presence statistics
    this.matchAvailabilityService.getMatchAvailabilities().subscribe(availabilities => {
      // Load all training presences to compute training presence statistics
      this.presenceService.getTrainingPresences().subscribe(trainingPresences => {
        availabilities.forEach(availability => {
          let numTrainings = trainingPresences.trainings.length;
          let numPresence = trainingPresences.trainings.filter(training => availability.name in training.presences && training.presences[availability.name].presenceType === "Présent").length;
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