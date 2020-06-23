import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatFormFieldModule, MatInputModule } from '@angular/material'; 
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { PresenceList } from '../../shared/presenceList';

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
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss'],
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
export class AddTrainingComponent implements OnInit {

  trainingPresences: PresenceList;
  trainingForm: FormGroup;
  presences: string[];

  constructor(public dialogRef: MatDialogRef<AddTrainingComponent>, private formBuilder: FormBuilder, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.trainingPresences = this.data.currentPresence;
    this.trainingForm = this.formBuilder.group({
      date: [new Date(), Validators.required],
      presenceList: new FormArray([])
    });

    this.presences = this.trainingPresences.presences.map(presence => presence.player);
    this.addCheckboxes()

    this.trainingForm.controls.date.valueChanges.subscribe(data => {
      console.log("Date changed");
      this.onValueChanged(data);
    });
    
    this.onValueChanged(this.trainingForm.controls.date.value); 
  }

  private addCheckboxes() {
    this.presences.forEach((o, i) => {
      const control = new FormControl(false);
      (this.trainingForm.controls.presenceList as FormArray).push(control);
    });
  }

  ngOnInit() { }

  onValueChanged(data?: any) {
    let label = data.toLocaleDateString();
    let index = this.data.currentPresence.labels.findIndex(lab => lab.slice(0, 10) === label);
    let initialCheckboxStates = this.trainingPresences.presences.map(presence => false)

    if (index != -1) {
      initialCheckboxStates = this.trainingPresences.presences.map(presence => presence.presenceTypes[index] === "Présent");
    }
    this.trainingForm.controls.presenceList.patchValue(initialCheckboxStates);
  }

  onSubmit() {
    this.dialogRef.close({data: this.trainingForm.value});
  }

}
