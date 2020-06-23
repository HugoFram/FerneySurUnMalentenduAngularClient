import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatFormFieldModule, MatInputModule } from '@angular/material'; 
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-delete-training',
  templateUrl: './delete-training.component.html',
  styleUrls: ['./delete-training.component.scss']
})
export class DeleteTrainingComponent implements OnInit {

  deleteForm: FormGroup;
  trainings: string[];

  constructor(public dialogRef: MatDialogRef<DeleteTrainingComponent>, private formBuilder: FormBuilder, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.trainings = this.data.existingTrainings
    console.log(this.trainings[this.trainings.length - 1]);
    this.deleteForm = this.formBuilder.group({
      training: this.trainings.length - 1
    });
  }

  ngOnInit() { }

  onSubmit() {
    console.log(this.deleteForm.value);
    console.log(this.deleteForm.controls.training.value);
    this.dialogRef.close({data: this.deleteForm.controls.training.value});
  }

}
