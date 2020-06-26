import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatFormFieldModule, MatInputModule } from '@angular/material'; 
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-delete-match',
  templateUrl: './delete-match.component.html',
  styleUrls: ['./delete-match.component.scss']
})
export class DeleteMatchComponent implements OnInit {

  deleteForm: FormGroup;
  matches: string[];

  constructor(public dialogRef: MatDialogRef<DeleteMatchComponent>, private formBuilder: FormBuilder, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.matches = this.data.existingMatches.map((match) => match.split("<br>").join(" - "));
    this.deleteForm = this.formBuilder.group({
      match: this.matches.length - 1
    });
  }

  ngOnInit() { }

  onSubmit() {
    this.dialogRef.close({data: this.deleteForm.controls.match.value});
  }

}
