import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatFormFieldModule, MatInputModule } from '@angular/material'; 
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, NativeDateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { PresenceList } from '../../shared/presenceList';

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
  selector: 'app-add-match',
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.scss'],
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
export class AddMatchComponent implements OnInit {

  matchPresences: PresenceList;
  matchForm: FormGroup;
  presences: string[];

  errMess: string;
  isLoading: boolean = false;

  formErrors = {
    'opponent': '',
    'setsWon': '',
    'setsLost': ''
  };

  validationMessages = {
    'opponent': {
      'required': "L'adversaire doit être indiqué.",
      'minlength': "Le nom de l'adversaire doit faire plus que 2 lettres."
    },
    'setsWon': {
      'required': 'Le nombre de sets gagnés doit être indiqué.',
      'pattern': 'Le nombre de sets gagnés doit être entre 0 et 3.'
    },
    'setsLost': {
      'required': 'Le nombre de sets perdus doit être indiqué.',
      'pattern': 'Le nombre de sets perdus doit être entre 0 et 3.'
    }
  };

  constructor(public dialogRef: MatDialogRef<AddMatchComponent>, private formBuilder: FormBuilder, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.matchPresences = this.data.currentPresence;
    this.matchForm = this.formBuilder.group({
      opponent: ['', [Validators.required, Validators.minLength(2)]],
      setsWon: ['', [Validators.required, Validators.pattern]],
      setsLost: ['', [Validators.required, Validators.pattern]],
      date: [new Date(), Validators.required],
      presenceList: new FormArray([]),
      presenceWithoutPlayingList: new FormArray([])
    });

    this.presences = this.matchPresences.presences.map(presence => presence.player);
    if (this.presences.length == 0) {
      this.presences = this.data.players.map(player => player.firstname)
    }

    this.addPresenceCheckboxes();
    this.addPresenceWithoutPlayingCheckboxes();

    this.matchForm.controls.date.valueChanges.subscribe(data => {
      this.onDateChanged(data);
    });
    
    this.onDateChanged(this.matchForm.controls.date.value); 

    this.matchForm.valueChanges.subscribe(data => {
      this.onInfoChanged(data);
    });
    
    this.onInfoChanged(this.matchForm.controls.date.value); 
  }

  private addPresenceCheckboxes() {
    this.presences.forEach((o, i) => {
      const control = new FormControl(false);
      (this.matchForm.controls.presenceList as FormArray).push(control);
    });
  }

  private addPresenceWithoutPlayingCheckboxes() {
    this.presences.forEach((o, i) => {
      const control = new FormControl(false);
      (this.matchForm.controls.presenceWithoutPlayingList as FormArray).push(control);
    });
  }

  ngOnInit() { }

  onDateChanged(data?: any) {
    let label = data.toLocaleDateString();
    let index = this.data.currentPresence.labels.findIndex(lab => lab.slice(lab.length - 19, lab.length - 9) === label);
    let initialPresenceCheckboxStates = this.matchPresences.presences.map(presence => false);
    let initialPresenceWithoutPlayingCheckboxStates = this.matchPresences.presences.map(presence => false);
    let initialOpponent = '';
    let initialSetsWon = '';
    let initialSetsLost = '';

    if (index != -1) {
      initialPresenceCheckboxStates = this.matchPresences.presences.map(presence => presence.presenceTypes[index] === "Présent");
      initialPresenceWithoutPlayingCheckboxStates = this.matchPresences.presences.map(presence => presence.presenceTypes[index] === "Présent sans jouer");
      let lab = this.matchPresences.labels[index]
      initialOpponent = lab.slice(0, lab.length - 23);
      initialSetsWon = lab.slice(lab.length - 4, lab.length - 3);
      initialSetsLost = lab.slice(lab.length - 2, lab.length - 1);
    }
    this.matchForm.controls.presenceList.patchValue(initialPresenceCheckboxStates);
    this.matchForm.controls.presenceWithoutPlayingList.patchValue(initialPresenceWithoutPlayingCheckboxStates);  
    this.matchForm.controls.opponent.patchValue(initialOpponent);  
    this.matchForm.controls.setsWon.patchValue(initialSetsWon);  
    this.matchForm.controls.setsLost.patchValue(initialSetsLost);    
  }

  onSubmit() {
    this.dialogRef.close({data: this.matchForm.value});
  }

  onInfoChanged(data?: any) {
    if (!this.matchForm) {
      return;
    } else {
      const form = this.matchForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }
  }

}
