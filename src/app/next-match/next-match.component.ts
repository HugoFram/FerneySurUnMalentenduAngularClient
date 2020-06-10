import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Match  } from '../shared/match';
import { NextMatch  } from '../shared/nextMatch';
import { MATCHES } from '../shared/matches';
import { Room } from '../shared/room';
import { ROOMS } from '../shared/rooms';

import { MapService } from '../services/map.service';


@Component({
  selector: 'app-next-match',
  templateUrl: './next-match.component.html',
  styleUrls: ['./next-match.component.scss']
})
export class NextMatchComponent implements OnInit, AfterViewInit {

  nextMatches: NextMatch[];
  rooms: Room[]; ROOMS;
  selectedRoom: Room;
  homeTeam: string;

  private map;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.nextMatches = MATCHES.filter((match) => (match.date > new Date()) && (match.visitor == "Ferney sur un malentendu" || match.home == "Ferney sur un malentendu")).
      map((match) => {
        let nextMatch: NextMatch;
        nextMatch = {
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

    this.selectedRoom = ROOMS.filter((room) => room.address === this.nextMatches[0].place)[0];
    this.homeTeam = this.nextMatches[0].homeOrVisitor == "Domicile" ? "Ferney sur un malentendu" : this.nextMatches[0].opponent;
  }

  ngAfterViewInit(): void {
    this.map = this.mapService.initMap(this.map, this.selectedRoom.longitude, this.selectedRoom.latitude, this.homeTeam);
  }

  onTabChange($event) {
    let match = this.nextMatches[$event.index];
    this.selectedRoom = ROOMS.filter((room) => room.address === match.place)[0];
    this.homeTeam = match.homeOrVisitor == "Domicile" ? "Ferney sur un malentendu" : match.opponent;
    this.map = this.mapService.refreshMap(this.map, this.selectedRoom.longitude, this.selectedRoom.latitude, this.homeTeam);
  }

}
