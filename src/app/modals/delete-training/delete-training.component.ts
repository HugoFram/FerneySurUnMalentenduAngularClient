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
    this.trainings = this.data.existingTrainings.map(training => training.label);
    this.deleteForm = this.formBuilder.group({
      training: this.trainings.length - 1
    });
  }

  ngOnInit() { }

  onSubmit() {
    this.dialogRef.close({data: this.deleteForm.controls.training.value});
  }

}
