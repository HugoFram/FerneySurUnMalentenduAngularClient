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
    HeaderComponent
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
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
