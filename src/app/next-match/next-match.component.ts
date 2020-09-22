import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginComponent } from '../modals/login/login.component';
import { AvailabilityComponent } from '../modals/availability/availability.component';

import { Match  } from '../shared/match';
import { NextMatch  } from '../shared/nextMatch';
import { MatchAvailability } from '../shared/matchAvailability';
import { Availability } from '../shared/availability';
import { AvailabilityDbFormat } from '../shared/availabilityDbFormat';
import { Room } from '../shared/room';
import { Player } from '../shared/player';

import { MapService } from '../services/map.service';
import { MatchAvailabilityService } from '../services/match-availability.service';
import { MatchService } from '../services/match.service';
import { RoomService } from '../services/room.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-next-match',
  templateUrl: './next-match.component.html',
  styleUrls: ['./next-match.component.scss']
})
export class NextMatchComponent implements OnInit, AfterViewInit {

  nextMatches: NextMatch[];
  selectedRoom: Room;
  homeTeam: string;
  matchAvailabilities: MatchAvailability[];
  matches: Match[];
  rooms: Room[];
  matchAvailability: MatchAvailability;
  availabilityTableData: Availability[];
  loggedPlayer: string;
  availabilityErrMess: string;
  matchErrMess: string;
  roomErrMess: string;

  @ViewChild(MatSort) sort: MatSort;

  private map;

  constructor(private dialog: MatDialog, private mapService: MapService, private matchAvailabilityService: MatchAvailabilityService, 
              private matchService: MatchService, private roomService: RoomService, private playerService: PlayerService) {}

  ngOnInit() {
    this.matchAvailabilityService.getMatchAvailabilities().subscribe(availabilities => {
      let match_availabilities = new Array<MatchAvailability>();
      
      availabilities.forEach(availability => {
        let index = match_availabilities.findIndex(matchav => matchav.matchNum == availability.matchNum);
        if (index == -1) {
          match_availabilities.push(new MatchAvailability())
          index = match_availabilities.length - 1;
          match_availabilities[index] = {
            matchNum: availability.matchNum,
            availabilities: new Array<Availability>()
          }
        }
        let av = new Availability();
        let pl = this.playerService.getPlayer(availability.name);
        if (pl) {
          av = {
            player: pl,
            availabilityType: availability.availability,
            trainingPresence: availability.trainingPresence,
            matchPresence: availability.matchPresence,
            selection: availability.selected
          };
          match_availabilities[index].availabilities.push(av);
        }
      });

      if (match_availabilities.length > 0) {
        this.matchAvailabilities = match_availabilities;
        this.availabilityTableData = this.matchAvailabilities[0].availabilities.slice();
      }
      this.matchService.getMatches().subscribe(matches => {
        this.matches = matches.map(match => {
          match.date = new Date(match.date);
          return match;
        });

        this.roomService.getRooms().subscribe(rooms => {
          this.rooms = rooms;

          this.nextMatches = this.matches.sort((matchA, matchB) => Number(matchA.date) - Number(matchB.date)).filter((match) => (match.date > new Date()) && (match.visitor == "Ferney sur un malentendu" || match.home == "Ferney sur un malentendu"))
          .map((match) => {
            let nextMatch: NextMatch;
            nextMatch = {
              matchNum: match.id,
              opponent: match.visitor == "Ferney sur un malentendu" ? match.home : match.visitor,
              date: match.date,
              hour: match.hour,
              homeOrVisitor: match.visitor == "Ferney sur un malentendu" ? "Extérieur" : "Domicile",
              place: match.place,
              opponentRank: "Classé 5e",
              previousEncounter: "Première Rencontre"
            };
            return nextMatch;
          }).slice(0,3);

          if (this.nextMatches.length > 0) {
            this.selectedRoom = this.rooms.filter((room) => room.address == this.nextMatches[0].place)[0];
            this.homeTeam = this.nextMatches[0].homeOrVisitor == "Domicile" ? "Ferney sur un malentendu" : this.nextMatches[0].opponent;
  
            if (match_availabilities.length > 0) {
              this.matchAvailability = this.matchAvailabilities.filter((matchAv) => matchAv.matchNum == this.nextMatches[0].matchNum)[0];
    
              if (this.matchAvailability && this.matchAvailability.availabilities.length > 0) {
                this.availabilityTableData = this.matchAvailability.availabilities.slice();
              } else {
                this.availabilityTableData = null;
              }
            }
  
            this.playerService.getLoggedPlayer().subscribe((player) => this.loggedPlayer = player);
  
            this.map = this.mapService.initMap(this.map, this.selectedRoom.latitude, this.selectedRoom.longitude, this.homeTeam);
          }
        }, errmess => this.roomErrMess = <any>errmess);
      }, errmess => this.matchErrMess = <any>errmess);
    }, errmess => this.availabilityErrMess = <any>errmess);
  }

  ngAfterViewInit(): void {
    
  }

  onTabChange($event) {
    let match = this.nextMatches[$event.index];
    this.selectedRoom = this.rooms.filter((room) => room.address === match.place)[0];
    this.homeTeam = match.homeOrVisitor == "Domicile" ? "Ferney sur un malentendu" : match.opponent;
    this.map = this.mapService.refreshMap(this.map, this.selectedRoom.latitude, this.selectedRoom.longitude, this.homeTeam);
    if (this.matchAvailabilities) {
      this.matchAvailability = this.matchAvailabilities.filter((matchAv) => matchAv.matchNum == match.matchNum)[0];

      if (this.matchAvailability && this.matchAvailability.availabilities.length > 0) {
        this.availabilityTableData = this.matchAvailability.availabilities.slice();
      } else {
        this.availabilityTableData = null;
      }
    }
  }

  sortData(sort: Sort) {
    const data = this.matchAvailability.availabilities.slice();
    if (!sort.active || sort.direction === '') {
      this.availabilityTableData = data;
      return;
    }

    this.availabilityTableData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'playerName': return compare(a.player.firstname, b.player.firstname, isAsc);
        case 'availabilityType': return compare(a.availabilityType, b.availabilityType, isAsc);
        case 'playerRole': return compare(a.player.role, b.player.role, isAsc);
        case 'trainingPresence': return compare(a.trainingPresence, b.trainingPresence, isAsc);
        case 'matchPresence': return compare(a.matchPresence, b.matchPresence, isAsc);
        case 'selection': return compare(a.selection, b.selection, isAsc);
        default: return 0;
      }
    });
  }

  enterAvailability() {
    if (this.loggedPlayer == "-") {
      this.dialog.open(LoginComponent);
    }
    else {
      let existingAvailabity = this.matchAvailability.availabilities.filter(availability => availability.player.firstname == this.loggedPlayer)[0];
      let dialogRef;
      if (existingAvailabity) {
        dialogRef = this.dialog.open(AvailabilityComponent, {data: { currentAvailability: existingAvailabity.availabilityType } });
      } else {
        dialogRef = this.dialog.open(AvailabilityComponent, {data: { currentAvailability: "Disponible" } });
      }
  
      dialogRef.afterClosed().subscribe(result => {
        let newAvailability: Availability;
        let existingAvailabity: Availability;
        let player: Player = this.playerService.getPlayer(this.loggedPlayer);
        let availabilityId: number;

        player.role = result.data.role;
        existingAvailabity = this.matchAvailability.availabilities.filter(availability => availability.player.firstname == this.loggedPlayer)[0];
        console.log(existingAvailabity);
        if (existingAvailabity) {
          this.matchAvailability.availabilities = this.matchAvailability.availabilities.filter(availability =>  availability.player.firstname != this.loggedPlayer);
        }

        newAvailability = {
          player: player,
          availabilityType: result.data.availability,
          trainingPresence: "61 % (11/18)",
          matchPresence: "100 % (9/9)",
          selection: "Indeterminé"
        };
        console.log('Data pushed', newAvailability);
        this.matchAvailability.availabilities.push(newAvailability);
        this.availabilityTableData = this.matchAvailability.availabilities.slice();
      });
    }
  }

}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
