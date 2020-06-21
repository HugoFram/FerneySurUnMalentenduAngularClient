import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { BehaviorSubject } from 'rxjs';

import { PlayerService } from '../services/player.service';
import { Player } from '../shared/player';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedPlayer: string;

  constructor(private dialog: MatDialog, private playerService: PlayerService) { }

  ngOnInit() {
    this.playerService.getLoggedPlayer().subscribe((player) => this.loggedPlayer = player);
  }

  openLoginForm() {
    this.dialog.open(LoginComponent);
  }

}
