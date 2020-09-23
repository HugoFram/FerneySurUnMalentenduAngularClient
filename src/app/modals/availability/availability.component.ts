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

  loggedPlayer: string;
  player: Player;
  availabilityForm: FormGroup
  errMess: String;

  constructor(public dialogRef: MatDialogRef<AvailabilityComponent>, private playerService: PlayerService, private formBuild: FormBuilder, 
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.playerService.getLoggedPlayer().subscribe((pl) => this.loggedPlayer = pl);
    this.playerService.getPlayer(this.loggedPlayer).subscribe(pl => {
      this.player = pl;
      this.availabilityForm = this.formBuild.group({
        role: this.player.role,
        availability: this.data.currentAvailability
      });
    }, errmess => this.errMess = <any>errmess);
  }

  onSubmit() {
    this.dialogRef.close({data: this.availabilityForm.value});
  }

}
