import { Component, OnInit } from '@angular/core';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';

import { PlayerComponent } from '../modals/player/player.component';

import { Player } from '../shared/player';

import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  players: Player[];
  playersTableData: Player[];
  errMess: string;

  constructor(private playerService: PlayerService, private dialog: MatDialog) { }

  ngOnInit() {
    this.playerService.getPlayers().subscribe(players => {
      this.players = players;
      this.sortData({active: "firstname", direction: "asc"});
    }, errmess => this.errMess = <any>errmess);
  }

  sortData(sort: Sort) {
    const data = this.players.slice();
    if (!sort.active || sort.direction === '') {
      this.playersTableData = data;
      return;
    }

    this.playersTableData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstname': return compare(a.firstname, b.firstname, isAsc);
        case 'lastname': return compare(a.lastname, b.lastname, isAsc);
        case 'role': return compare(a.role, b.role, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        default: return 0;
      }
    });
  }

  openPlayerModal(player: Player) {
    const dialogRef = this.dialog.open(PlayerComponent, {data: {player: player}});
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        if (result.isDeleteClicked) {
          this.removePlayer(result.data.firstname);
        } else {
          let updatedPlayer = result.data;
          let index = this.players.findIndex(member => member.firstname === player.firstname);
          if (index != -1) {
            this.players.splice(index, 1, updatedPlayer);
          } else {
            this.players.push(updatedPlayer);
          }
          this.sortData({active: "firstname", direction: "asc"});
          this.playerService.postPlayer(result.data.firstname, updatedPlayer).subscribe();
        }
      }
    });
  }

  onPlayerClick(player: Player) {
    this.openPlayerModal(player);
  }

  onAddPlayerClick() {
    let player = new Player();
    this.openPlayerModal(player);
  }

  removePlayer(playerName: string) {
    let index = this.players.findIndex(member => member.firstname == playerName);
    if (index != -1) {
      this.players.splice(index, 1);
    }
    this.sortData({active: "firstname", direction: "asc"});
    this.playerService.deletePlayer(playerName).subscribe();
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
