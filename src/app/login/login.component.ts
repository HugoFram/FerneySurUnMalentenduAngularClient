import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Player } from '../shared/player';

import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  players: Player[];
  selectedPlayer: string;
  playerForm: FormGroup

  constructor(public dialogRef: MatDialogRef<LoginComponent>, private playerService: PlayerService, private formBuild: FormBuilder) { 
    this.playerForm = this.formBuild.group({
      playerName: ['-', Validators.minLength(2)]
    });
    this.players = this.playerService.getPlayers();
    //this.playerForm.valueChanges.subscribe(data => this.onValueChanged(data));
    
    //this.onValueChanged(); 
  }

  ngOnInit() { }

  onSubmit() {
    console.log('Player: ', this.selectedPlayer);
    this.selectedPlayer = this.playerForm.value.playerName;
    this.playerService.setLoggedPlayer(this.selectedPlayer);
    this.dialogRef.close();
  }

  //onValueChanged(data?: any) {
  //  this.selectedPlayer = this.playerForm.value.playerName;
  //  this.playerService.setLoggedPlayer(this.selectedPlayer);
  //  console.log(this.selectedPlayer);
  //}

}
