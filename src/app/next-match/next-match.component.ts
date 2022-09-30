import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Params, ActivatedRoute } from '@angular/router';

import { LoginComponent } from '../modals/login/login.component';
import { AvailabilityComponent } from '../modals/availability/availability.component';
import { ReminderConfirmationComponent } from '../modals/reminder-confirmation/reminder-confirmation.component';

import { Match  } from '../shared/match';
import { NextMatch  } from '../shared/nextMatch';
import { MatchAvailability } from '../shared/matchAvailability';
import { Availability } from '../shared/availability';
import { PastMatchAvailability } from '../shared/pastMatchAvailability';
import { Room } from '../shared/room';
import { Player } from '../shared/player';
import { Email } from '../shared/email';
import { buildReminderEmail } from '../shared/email-builders/reminder';
import { buildAvailabilityConfirmationEmail } from '../shared/email-builders/availability-confirmation';
import { buildTeamValidationEmail } from '../shared/email-builders/team-validation';

import { MapService } from '../services/map.service';
import { MatchAvailabilityService } from '../services/match-availability.service';
import { MatchService } from '../services/match.service';
import { RoomService } from '../services/room.service';
import { PlayerService } from '../services/player.service';
import { PresenceService } from '../services/presence.service';
import { SendmailService } from '../services/sendmail.service';
import { ConfigService } from '../services/config.service';
import { RankService } from '../services/rank.service';

@Component({
  selector: 'app-next-match',
  templateUrl: './next-match.component.html',
  styleUrls: ['./next-match.component.scss']
})
export class NextMatchComponent implements OnInit, AfterViewInit {

  nextMatches: NextMatch[];
  selectedTabIndex: number;
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
  rankErrMess: string;
  playerErrMess: string;
  trainingPresenceErrMess: string;
  matchPresenceErrMess: string;
  matchPastAvailabilityErrMess: string;
  checkedCheckboxes: { [id: string]: boolean } = {};

  @ViewChild(MatSort) sort: MatSort;

  private map;

  constructor(private dialog: MatDialog, private mapService: MapService, private matchAvailabilityService: MatchAvailabilityService, private rankService: RankService,
              private matchService: MatchService, private roomService: RoomService, private playerService: PlayerService, private presenceService: PresenceService,
              private sendmailService: SendmailService, private configService: ConfigService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.matchAvailabilityService.getMatchAvailabilities().subscribe(availabilities => {
      let match_availabilities = new Array<MatchAvailability>();

      this.matchAvailabilityService.getPastMatchAvailabilities().subscribe(pastAvailabilities => {
        this.playerService.getPlayers().subscribe(players => {
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
            if (players) {
              let player = players.filter(player => player.firstname == availability.name)[0];
              if (player) {
                let pastAv: string;
                if (pastAvailabilities.length > 0) {
                  pastAv = pastAvailabilities.filter(pastAv => pastAv.name == player.firstname).length > 0 ? pastAvailabilities.filter(pastAv => pastAv.name == player.firstname)[0].pastMatchesAvailability : '';
                } else {
                  pastAv = ''
                }
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
                  pastAvailability: pastAv ? pastAv : '',
                  selection: availability.selected
                };
                match_availabilities[index].availabilities.push(av);
              }
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
              this.rankService.getRanks().subscribe(ranks => {
                this.nextMatches = this.matches.sort((matchA, matchB) => Number(matchA.date) - Number(matchB.date)).filter((match) => (match.date > new Date()) && (match.visitor == "Ferney sur un malentendu" || match.home == "Ferney sur un malentendu"))
                .map((match) => {
                  let nextMatch: NextMatch;
                  let isHome = match.home == "Ferney sur un malentendu";
                  let opponent = isHome ? match.visitor : match.home;
                  let opponentRank = ranks.length > 0 ? ranks.filter(rank => rank.team == opponent)[0].rank : 0;
                  let previousEncounter = this.matches.filter(_match => _match.date < new Date() && _match.sets != "-" && ((_match.home == "Ferney sur un malentendu" && _match.visitor == opponent) || (_match.visitor == "Ferney sur un malentendu" && _match.home == opponent)))[0];
                  let ourSetsPreviousEncounter, previousEncounterResult;
                  if (previousEncounter) {
                    // If the current match is home, then the previous encounter was not home
                    ourSetsPreviousEncounter = parseInt(isHome ? previousEncounter.sets.slice(4,5) : previousEncounter.sets.slice(0,1));
                    previousEncounterResult = (ourSetsPreviousEncounter == 3 ? "Victoire (" : "Défaite (") + previousEncounter.sets + ")";
                  }
                  nextMatch = {
                    matchNum: match.id,
                    opponent: opponent, 
                    date: match.date,
                    hour: match.hour,
                    homeOrVisitor: match.visitor == "Ferney sur un malentendu" ? "Extérieur" : "Domicile",
                    place: match.place,
                    opponentRank: "Classé " + (opponentRank == 1 ? opponentRank + "er" : opponentRank + "e"),
                    previousEncounter: previousEncounterResult ? previousEncounterResult : "Première Rencontre"
                  };
                  return nextMatch;
                }).slice(0,3);
      
                if (this.nextMatches.length > 0) {
                  this.selectedMatch = this.nextMatches[0];
                  this.selectedTabIndex = 0;
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

                  if (this.matchAvailability.availabilities.some(availability => availability.selection != "Indeterminé")) {
                    this.sortData({active: "selection", direction: "desc"});
                  } else {
                    this.sortData({active: "availabilityType", direction: "asc"});
                  }

                  // Deal with query parameters provided in case of availability provisioned by clicking on e-mail buttons
                  let queryParams;
                  this.route.queryParams.subscribe(params => queryParams = params);
                  if (queryParams.playerName) {
                    if (queryParams.matchNum != this.selectedMatch.matchNum) {
                      this.selectedTabIndex = this.nextMatches.findIndex(match => match.matchNum == queryParams.matchNum);
                      this.onTabChange({index: this.selectedTabIndex });
                    }
                    this.playerService.getPlayer(queryParams.playerName).subscribe(player => {
                      let availability = queryParams.available == "yes" ? "Disponible" : (queryParams.available == "maybe" ? "Disponible si besoin" : "Non disponible");
                      this.enterAvailability(player.firstname, player.role, availability);

                      let emailContent = buildAvailabilityConfirmationEmail(player.firstname, availability, this.nextMatches.filter(match => match.matchNum == queryParams.matchNum)[0].date, this.configService.appURL);
                      let email = new Email();
                      email = {
                        recipient: this.configService.debugEmail,
                        subject: "[AUTO] Next Match Availability (reminder)",
                        content: emailContent
                      };
                      
                      this.sendmailService.postSendmailOnePlayer(email).subscribe();

                      if (this.matchAvailability.availabilities.some(availability => availability.selection != "Indeterminé")) {
                        this.sortData({active: "selection", direction: "desc"});
                      } else {
                        this.sortData({active: "availabilityType", direction: "asc"});
                      }
                    }, errmess => this.playerErrMess = <any>errmess);
                  }
                }
              }, errmess => this.rankErrMess = <any>errmess);
            }, errmess => this.roomErrMess = <any>errmess);
          }, errmess => this.matchErrMess = <any>errmess);
        }, errmess => this.playerErrMess = <any>errmess);
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
        if (this.matchAvailability.availabilities.some(availability => availability.selection != "Indeterminé")) {
          this.sortData({active: "selection", direction: "desc"});
        } else {
          this.sortData({active: "availabilityType", direction: "asc"});
        }
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

  enterAvailability(playerName: string, playerRole: string, playerAvailability: string) {
    let newAvailability: Availability;
    let existingAvailability = null;
    let player: Player;
    let availabilityId: number;
    
    // Retrieve player information
    this.playerService.getPlayer(playerName).subscribe(pl => {
      player = pl;
      player.role = playerRole;
      if (this.matchAvailability) {
        existingAvailability = this.matchAvailability.availabilities.filter(availability => availability.player.firstname == this.loggedPlayer)[0];
      }
      if (existingAvailability) {
        this.matchAvailability.availabilities = this.matchAvailability.availabilities.filter(availability =>  availability.player.firstname != this.loggedPlayer);
      }
      
      // Compute Training Presence string
      this.presenceService.getTrainingPresences().subscribe(presences => {
        console.log(presences);
        let numTrainings = presences.trainings.filter(training => player.firstname in training.presences).length;
        let numPresence = presences.trainings.filter(training => player.firstname in training.presences && training.presences[player.firstname].name == "Présent").length;
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
                role: playerRole,
                email: player.email
              },
              availabilityType: playerAvailability,
              trainingPresence: trainingPresence,
              matchPresence: matchPresence,
              pastAvailability: pastAvailability ? pastAvailability.pastMatchesAvailability : '',
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
            if (this.matchAvailability.availabilities.some(availability => availability.selection != "Indeterminé")) {
              this.sortData({active: "selection", direction: "desc"});
            } else {
              this.sortData({active: "availabilityType", direction: "asc"});
            }
            console.log(this.selectedMatch.matchNum);

            this.matchAvailabilityService.postMatchAvailability(this.selectedMatch.matchNum, player.firstname, {
              matchNum: this.selectedMatch.matchNum,
              name: player.firstname,
              availability: playerAvailability,
              role: playerRole,
              selected: "Indeterminé",
              trainingPresence: trainingPresence,
              matchPresence: matchPresence
            }).subscribe();
          }, errmess => this.matchPastAvailabilityErrMess = <any>errmess);
        }, errmess => this.matchPresenceErrMess = <any>errmess);
      }, errmess => this.trainingPresenceErrMess = <any>errmess);
    }, errmess => this.matchErrMess = <any>errmess);
  }

  chooseAvailability() {
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
        this.enterAvailability(this.loggedPlayer, result.data.role, result.data.availability);

        let emailContent = buildAvailabilityConfirmationEmail(this.loggedPlayer, result.data.availability, this.selectedMatch.date, this.configService.appURL);
        let email = new Email();
        email = {
          recipient: this.configService.debugEmail,
          subject: "[AUTO] Next Match Availability (application)",
          content: emailContent
        };
        
        this.sendmailService.postSendmailOnePlayer(email).subscribe();
      }
    });
  }

  onEnterAvailabilityClick() {
    let dialogRef;
    if (this.loggedPlayer == "-") {
      dialogRef = this.dialog.open(LoginComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result.success) {
          this.chooseAvailability();
        }
      });
    }
    else {
      this.chooseAvailability();
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

  onValidateTeamClick() {
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

    let emailContent = buildTeamValidationEmail(this.selectedMatch.date, this.matchAvailability, this.configService.appURL);

    let email = new Email();

    email = {
      recipient: this.configService.debugEmail,
      subject: "[AUTO] Team Validation",
      content: emailContent
    }

    this.sendmailService.postSendmailOnePlayer(email).subscribe();
  }

  onSendReminderClick() {
    this.playerService.getPlayers().subscribe(players => {
      let emailsSummary = `<div class="text" style="padding: 0 3em; text-align: center;">
                              <h2>Salut Cédric,</h2>
                              <h3>Voici les rappels que tu as envoyé.</h3>
                            </div>
                            <hr>
                            <hr>`;

      let remainingPlayers = new Array<Player>();
      players.filter(player => this.matchAvailability.availabilities.map(availability => availability.player.firstname).findIndex(name => player.firstname == name) === -1).forEach(player =>  {
        remainingPlayers.push(player);
        let email = new Email();
        let emailContent = buildReminderEmail(player.firstname, this.selectedMatch.matchNum, this.selectedMatch.date, this.selectedMatch.hour, this.selectedMatch.place, 
                                              this.selectedMatch.opponent, this.selectedMatch.opponentRank, this.selectedMatch.previousEncounter, this.configService.appURL);
        emailsSummary += emailContent + '<hr>'
        email = {
          recipient: player.email,
          subject: "[VOLLEY] Prochain match",
          content: emailContent
        };
        
        this.sendmailService.postSendmailOnePlayer(email).subscribe();
      });

      // Send reminder e-mail summary to coach
      let summaryEmail = new Email();

      summaryEmail = {
        recipient: players.filter(player => player.firstname == "Cédric")[0].email,
        subject: "[VOLLEY] Prochain match",
        content: emailsSummary
      }

      this.sendmailService.postSendmailOnePlayer(summaryEmail).subscribe(result => {
        this.dialog.open(ReminderConfirmationComponent, {data: {remainingPlayers: remainingPlayers}})
      });

      // Send reminder e-mail summary to debug e-mail address
      let summaryEmailDebug = new Email();

      summaryEmailDebug = {
        recipient: this.configService.debugEmail,
        subject: "[AUTO] Reminder E-mail sent",
        content: emailsSummary
      }

      summaryEmailDebug.recipient = this.configService.debugEmail;
      this.sendmailService.postSendmailOnePlayer(summaryEmailDebug).subscribe();
    })
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
