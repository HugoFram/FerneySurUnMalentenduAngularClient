import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from '../../shared/player';

@Component({
  selector: 'app-reminder-confirmation',
  templateUrl: './reminder-confirmation.component.html',
  styleUrls: ['./reminder-confirmation.component.scss']
})
export class ReminderConfirmationComponent implements OnInit {
  playersWithAddress: Player[];
  playersWithoutAddress: Player[];

  constructor(public dialogRef: MatDialogRef<ReminderConfirmationComponent>, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.playersWithAddress = this.data.remainingPlayers.filter(player => player.email != "");
    this.playersWithoutAddress = this.data.remainingPlayers.filter(player => player.email == "");
  }

}
