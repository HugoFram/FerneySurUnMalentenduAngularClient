import { Component, OnInit } from '@angular/core';
import { Match  } from '../shared/match';
import { NextMatch  } from '../shared/nextMatch';
import { MATCHES } from '../shared/matches';


@Component({
  selector: 'app-next-match',
  templateUrl: './next-match.component.html',
  styleUrls: ['./next-match.component.scss']
})
export class NextMatchComponent implements OnInit {

  nextMatches: NextMatch[];

  constructor() { }

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
    });

  }

}
