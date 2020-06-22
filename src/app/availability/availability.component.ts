import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Player } from '../shared/player';

import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent implements OnInit {

  loggedPlayer: string;
  player: Player;
  availabilityForm: FormGroup

  constructor(public dialogRef: MatDialogRef<AvailabilityComponent>, private playerService: PlayerService, private formBuild: FormBuilder, 
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.playerService.getLoggedPlayer().subscribe((player) => this.loggedPlayer = player);
    this.player = playerService.getPlayer(this.loggedPlayer);

    console.log(this.player);
    
    this.availabilityForm = this.formBuild.group({
      role: this.player.role,
      availability: this.data.currentAvailability
    });
  }

  ngOnInit() { }

  onSubmit() {
    console.log(this.availabilityForm.value);
    this.dialogRef.close({data: this.availabilityForm.value});
  }

}
