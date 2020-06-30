import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatFormFieldModule, MatInputModule } from '@angular/material'; 
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { Player } from '../../shared/player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  player: Player;
  playerForm: FormGroup;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First Name is required.',
      'minlength': 'First Name must be at least 2 characters long.'
    },
    'lastname': {
      'required': 'Last Name is required.',
      'minlength': 'Last Name must be at least 2 characters long.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Email not in valid format.'
    }
  };

  constructor(public dialogRef: MatDialogRef<PlayerComponent>, private formBuilder: FormBuilder, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.player = this.data.player;
    this.playerForm = this.formBuilder.group({
      firstname: [this.player.firstname, [Validators.required, Validators.minLength(2)]],
      lastname: [this.player.lastname, [Validators.required, Validators.minLength(2)]],
      role: this.player.role,
      email: [this.player.email, [Validators.required, Validators.email]]
    });

    this.playerForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  ngOnInit() {
  }

  onValueChanged(data?: any) {
    if (!this.playerForm) {
      return;
    } else {
      const form = this.playerForm;
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

  onSubmit() {
    this.dialogRef.close({data: this.playerForm.value});
  }

}
