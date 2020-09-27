import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';

import { LoginComponent } from '../modals/login/login.component';
import { AvailabilityComponent } from '../modals/availability/availability.component';

import { Match  } from '../shared/match';
import { NextMatch  } from '../shared/nextMatch';
import { MatchAvailability } from '../shared/matchAvailability';
import { Availability } from '../shared/availability';
import { PastMatchAvailability } from '../shared/pastMatchAvailability';
import { Room } from '../shared/room';
import { Player } from '../shared/player';

import { MapService } from '../services/map.service';
import { MatchAvailabilityService } from '../services/match-availability.service';
import { MatchService } from '../services/match.service';
import { RoomService } from '../services/room.service';
import { PlayerService } from '../services/player.service';
import { PresenceService } from '../services/presence.service';

@Component({
  selector: 'app-next-match',
  templateUrl: './next-match.component.html',
  styleUrls: ['./next-match.component.scss']
})
export class NextMatchComponent implements OnInit, AfterViewInit {

  nextMatches: NextMatch[];
  selectedMatch: NextMatch;
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
  playerErrMess: string;
  trainingPresenceErrMess: string;
  matchPresenceErrMess: string;
  matchPastAvailabilityErrMess: string;
  checkedCheckboxes: { [id: string]: boolean } = {};

  @ViewChild(MatSort) sort: MatSort;

  private map;

  constructor(private dialog: MatDialog, private mapService: MapService, private matchAvailabilityService: MatchAvailabilityService, 
              private matchService: MatchService, private roomService: RoomService, private playerService: PlayerService, private presenceService: PresenceService) {}

  ngOnInit() {
    this.matchAvailabilityService.getMatchAvailabilities().subscribe(availabilities => {
      let match_availabilities = new Array<MatchAvailability>();

      this.matchAvailabilityService.getPastMatchAvailabilities().subscribe(pastAvailabilities => {
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
          this.playerService.getPlayer(availability.name).subscribe(player => {
            if (player) {
              av = {
                player: {
                  firstname: player.firstname,
                  lastname: player.lastname,
                  role: availability.role,
                  email: player.email
                },
                availabilityType: availability.availability,
                trainingPresence: availability.trainingPresence,
                matchPresence: availability.matchPresence,
                pastAvailability: pastAvailabilities.filter(pastAv => pastAv.name == player.firstname)[0].pastMatchesAvailability,
                selection: availability.selected
              };
              match_availabilities[index].availabilities.push(av);
            }
          }, errmess => this.matchErrMess = <any>errmess);
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
              this.selectedMatch = this.nextMatches[0];
              this.selectedRoom = this.rooms.filter((room) => room.address == this.selectedMatch.place)[0];
              this.homeTeam = this.nextMatches[0].homeOrVisitor == "Domicile" ? "Ferney sur un malentendu" : this.nextMatches[0].opponent;
    
              if (match_availabilities.length > 0) {
                this.matchAvailability = this.matchAvailabilities.filter((matchAv) => matchAv.matchNum == this.nextMatches[0].matchNum)[0];
      
                if (this.matchAvailability && this.matchAvailability.availabilities.length > 0) {
                  this.availabilityTableData = this.matchAvailability.availabilities.slice();
                  this.matchAvailability.availabilities.forEach(availability => this.checkedCheckboxes[availability.player.firstname] = availability.selection == "Sélectionné");
                  this.sortData({active: "availabilityType", direction: "asc"});
                } else {
                  this.availabilityTableData = null;
                }
              }
    
              this.playerService.getLoggedPlayer().subscribe((player) => this.loggedPlayer = player);
    
              this.map = this.mapService.initMap(this.map, this.selectedRoom.latitude, this.selectedRoom.longitude, this.homeTeam);
            }
          }, errmess => this.roomErrMess = <any>errmess);
        }, errmess => this.matchErrMess = <any>errmess);
      }, errmess => this.matchPastAvailabilityErrMess = <any>errmess);
    }, errmess => this.availabilityErrMess = <any>errmess);
  }

  ngAfterViewInit(): void {
    
  }

  onTabChange($event) {
    this.selectedMatch = this.nextMatches[$event.index];
    this.selectedRoom = this.rooms.filter((room) => room.address === this.selectedMatch.place)[0];
    this.homeTeam = this.selectedMatch.homeOrVisitor == "Domicile" ? "Ferney sur un malentendu" : this.selectedMatch.opponent;
    this.map = this.mapService.refreshMap(this.map, this.selectedRoom.latitude, this.selectedRoom.longitude, this.homeTeam);
    if (this.matchAvailabilities) {
      this.matchAvailability = this.matchAvailabilities.filter((matchAv) => matchAv.matchNum == this.selectedMatch.matchNum)[0];
      if (this.matchAvailability && this.matchAvailability.availabilities.length > 0) {
        this.availabilityTableData = this.matchAvailability.availabilities.slice();
        this.matchAvailability.availabilities.forEach(availability => this.checkedCheckboxes[availability.player.firstname] = availability.selection == "Sélectionné");
        this.sortData({active: "availabilityType", direction: "asc"});
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
        case 'pastAvailability': return compare(a.pastAvailability, b.pastAvailability, isAsc);
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
      let existingAvailability = null;
      if (this.matchAvailability) {
        existingAvailability = this.matchAvailability.availabilities.filter(availability => availability.player.firstname == this.loggedPlayer)[0];
      }
      let dialogRef;
      if (existingAvailability) {
        dialogRef = this.dialog.open(AvailabilityComponent, {data: { currentAvailability: existingAvailability } });
      } else {
        dialogRef = this.dialog.open(AvailabilityComponent, {data: { currentAvailability: null } });
      }
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let newAvailability: Availability;
          let existingAvailability = null;
          let player: Player;
          let availabilityId: number;
          
          // Retrieve player information
          this.playerService.getPlayer(this.loggedPlayer).subscribe(pl => {
            player = pl;
            player.role = result.data.role;
            if (this.matchAvailability) {
              existingAvailability = this.matchAvailability.availabilities.filter(availability => availability.player.firstname == this.loggedPlayer)[0];
            }
            if (existingAvailability) {
              this.matchAvailability.availabilities = this.matchAvailability.availabilities.filter(availability =>  availability.player.firstname != this.loggedPlayer);
            }
            
            // Compute Training Presence string
            this.presenceService.getTrainingPresences().subscribe(presences => {
              let numTrainings = presences.filter(presence => presence.name == player.firstname).length;
              let numPresence = presences.filter(presence => presence.name == player.firstname).map(presence => presence.presence == "Présent" ? 1 : 0).reduce((acc, val) => acc += val, 0);
              let trainingPresence = Math.round(100.0*numPresence / numTrainings) + " % (" + numPresence + "/" + numTrainings + ")";

              // Compute Match Presence string
              this.presenceService.getMatchPresences().subscribe(presences => {
                let numMatches = presences.filter(presence => presence.name == player.firstname).length;
                let numPresence = presences.filter(presence => presence.name == player.firstname).map(presence => presence.presence == "Présent" ? 1 : 0).reduce((acc, val) => acc += val, 0);
                let matchPresence = Math.round(100.0*numPresence / numMatches) + " % (" + numPresence + "/" + numMatches + ")";

                this.matchAvailabilityService.getPlayerPastMatchAvailability(player.firstname).subscribe(pastAvailability => {
                  newAvailability = {
                    player: {
                      firstname: player.firstname,
                      lastname: player.lastname,
                      role: result.data.role,
                      email: player.email
                    },
                    availabilityType: result.data.availability,
                    trainingPresence: trainingPresence,
                    matchPresence: matchPresence,
                    pastAvailability: pastAvailability.pastMatchesAvailability,
                    selection: "Indeterminé"
                  };
                  if (this.matchAvailability) {
                    this.matchAvailability.availabilities.push(newAvailability);
                  } else {
                    this.matchAvailability = new MatchAvailability();
                    this.matchAvailability.matchNum = this.selectedMatch.matchNum;
                    this.matchAvailability.availabilities = new Array<Availability>();
                    this.matchAvailability.availabilities.push(newAvailability);
                  }
                  this.checkedCheckboxes[newAvailability.player.firstname] = false;
                  if (this.matchAvailabilities) {
                    let index = this.matchAvailabilities.findIndex(matchAv => matchAv.matchNum == this.matchAvailability.matchNum);
                    if (index != -1) {
                      this.matchAvailabilities[index] = this.matchAvailability;
                    } else {
                      this.matchAvailabilities.push(this.matchAvailability);
                    }
                  } else {
                    this.matchAvailabilities = new Array<MatchAvailability>();
                    this.matchAvailabilities.push(this.matchAvailability);
                  }
                  this.availabilityTableData = this.matchAvailability.availabilities.slice();
                  this.sortData({active: "availabilityType", direction: "asc"});
  
                  this.matchAvailabilityService.postMatchAvailability(this.selectedMatch.matchNum, player.firstname, {
                    matchNum: this.selectedMatch.matchNum,
                    name: player.firstname,
                    availability: result.data.availability,
                    role: result.data.role,
                    selected: "Indeterminé",
                    trainingPresence: trainingPresence,
                    matchPresence: matchPresence
                  }).subscribe();
                }, errmess => this.matchPastAvailabilityErrMess = <any>errmess);
              }, errmess => this.matchPresenceErrMess = <any>errmess);
            }, errmess => this.trainingPresenceErrMess = <any>errmess);
          }, errmess => this.matchErrMess = <any>errmess);
        }
      });
    }
  }

  onAvailabilityRowClick(event: any) {
    let currentAvailability = this.matchAvailability.availabilities.filter(availability => availability.player.firstname == event.path[1].children[0].innerText)[0];
    let dialogRef = this.dialog.open(AvailabilityComponent, {data: { currentAvailability: currentAvailability } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newAvailability: Availability = {
          player: {
            firstname: currentAvailability.player.firstname,
            lastname: currentAvailability.player.lastname,
            role: result.data.role,
            email: currentAvailability.player.email
          },
          availabilityType: result.data.availability,
          trainingPresence: currentAvailability.trainingPresence,
          matchPresence: currentAvailability.matchPresence,
          pastAvailability: currentAvailability.pastAvailability,
          selection: currentAvailability.selection
        };
        this.matchAvailability.availabilities = this.matchAvailability.availabilities.filter(availability =>  availability.player.firstname != currentAvailability.player.firstname);
        this.matchAvailability.availabilities.push(newAvailability);
        let index = this.matchAvailabilities.findIndex(matchAv => matchAv.matchNum == this.matchAvailability.matchNum);
        this.matchAvailabilities[index] = this.matchAvailability;
        this.availabilityTableData = this.matchAvailability.availabilities.slice();
        this.sortData({active: "availabilityType", direction: "asc"});

        this.matchAvailabilityService.postMatchAvailability(this.selectedMatch.matchNum, newAvailability.player.firstname, {
          matchNum: this.selectedMatch.matchNum,
          name: newAvailability.player.firstname,
          availability: newAvailability.availabilityType,
          role: newAvailability.player.role,
          selected: newAvailability.selection,
          trainingPresence: newAvailability.trainingPresence,
          matchPresence: newAvailability.matchPresence
        }).subscribe();
      }
    });
  }

  onCheckboxChange(event: any) {
    let checkboxState = event.target.checked;
    let playerName = event.path[4].children[0].innerText;
    this.checkedCheckboxes[playerName] = checkboxState;
  }

  validateTeam() {
    this.matchAvailability.availabilities.forEach(availability => availability.selection = this.checkedCheckboxes[availability.player.firstname] ? "Sélectionné" : "Non Sélectionné");
    this.matchAvailabilityService.postMatchAvailabilities(this.selectedMatch.matchNum, this.matchAvailability.availabilities.map(availability => {
      return {
        matchNum: this.selectedMatch.matchNum,
        name: availability.player.firstname,
        availability: availability.availabilityType,
        role: availability.player.role,
        selected: availability.selection,
        trainingPresence: availability.trainingPresence,
        matchPresence: availability.matchPresence
      }
    })).subscribe();
    this.sortData({active: "selection", direction: "desc"});
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
