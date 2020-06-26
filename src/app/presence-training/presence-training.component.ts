import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';

import { AddTrainingComponent } from '../modals/add-training/add-training.component';
import { DeleteTrainingComponent } from '../modals/delete-training/delete-training.component';
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

  constructor(private presenceService: PresenceService, private dialog: MatDialog) { }

  ngOnInit() {
    this.trainingPresences = this.presenceService.getTrainingPresences();
  }

  openAddTrainingModal() {
    const dialogRef = this.dialog.open(AddTrainingComponent, {data: {currentPresence: this.trainingPresences}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        let label = result.data.date.toLocaleDateString() + " (" + result.data.presenceList.reduce((acc, cur) => acc + cur, 0) + ")";
        let index = this.trainingPresences.labels.findIndex(lab => lab.slice(0, 10) === label.slice(0, 10));
        if (index != -1) {
          this.trainingPresences.labels.splice(index, 1, label);
          this.trainingPresences.presences.forEach((presence, i) => presence.presenceTypes.splice(index, 1,result.data.presenceList[i] ? "Présent" : "Absent"));
        } else {
          this.trainingPresences.labels.push(label);
          this.trainingPresences.presences.forEach((presence, i) => presence.presenceTypes.push(result.data.presenceList[i] ? "Présent" : "Absent"));
        }
      }
    });

  }

  openDeleteTrainingModal() {
    const dialogRef = this.dialog.open(DeleteTrainingComponent, {data: {existingTrainings: this.trainingPresences.labels}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        let index = result.data;
        this.trainingPresences.labels.splice(index, 1);
        this.trainingPresences.presences.forEach(presence => presence.presenceTypes.splice(index, 1));
      }
    });
  }

}
