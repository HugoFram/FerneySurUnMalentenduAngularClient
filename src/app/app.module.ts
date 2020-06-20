import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { fromEventPattern } from 'rxjs';
import 'hammerjs';
import { NextMatchComponent } from './next-match/next-match.component';
import { RankingComponent } from './ranking/ranking.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TeamComponent } from './team/team.component';
import { PresenceTrainingComponent } from './presence-training/presence-training.component';
import { PresenceMatchComponent } from './presence-match/presence-match.component';
import { ResultsComponent } from './results/results.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';

import { MapService } from './services/map.service';
import { PlayerService } from './services/player.service';
import { MatchAvailabilityService } from './services/match-availability.service';
import { MatchService } from './services/match.service';
import { RoomService } from './services/room.service';

@NgModule({
  declarations: [
    AppComponent,
    NextMatchComponent,
    RankingComponent,
    CalendarComponent,
    TeamComponent,
    PresenceTrainingComponent,
    PresenceMatchComponent,
    ResultsComponent,
    HeaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule
  ],
  providers: [
    MapService,
    PlayerService,
    MatchAvailabilityService,
    MatchService,
    RoomService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginComponent
  ]
})
export class AppModule { }
