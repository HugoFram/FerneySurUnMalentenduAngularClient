import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Player } from '../../shared/player';

import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {

  availabilityForm: FormGroup
  errMess: String;

  constructor(public dialogRef: MatDialogRef<AvailabilityComponent>, private playerService: PlayerService, private formBuild: FormBuilder, 
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    let selectedPlayer;
    let availabilityType;
    if (this.data.currentAvailability) {
      selectedPlayer = this.data.currentAvailability.player.firstname;
      availabilityType = this.data.currentAvailability.availabilityType;
    } else {
      this.playerService.getLoggedPlayer().subscribe((pl) => selectedPlayer = pl);
      availabilityType = "Disponible";
    }
    this.playerService.getPlayer(selectedPlayer).subscribe(player => {
      this.availabilityForm = this.formBuild.group({
        role: this.data.currentAvailability ? this.data.currentAvailability.player.role : player.role,
        availability: availabilityType
      });
    }, errmess => this.errMess = <any>errmess);
  }

  onSubmit() {
    this.dialogRef.close({data: this.availabilityForm.value});
  }

}
