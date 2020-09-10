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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { MapService } from './services/map.service';
import { PlayerService } from './services/player.service';
import { MatchAvailabilityService } from './services/match-availability.service';
import { MatchService } from './services/match.service';
import { RoomService } from './services/room.service';
import { PresenceService } from './services/presence.service';
import { RankService } from './services/rank.service';
import { ProcessHTTPMsgService } from './services/process-httpmsg.service';

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
import { LoginComponent } from './modals/login/login.component';
import { AvailabilityComponent } from './modals/availability/availability.component';
import { AddTrainingComponent } from './modals/add-training/add-training.component';
import { DeleteTrainingComponent } from './modals/delete-training/delete-training.component';
import { AddMatchComponent } from './modals/add-match/add-match.component';
import { DeleteMatchComponent } from './modals/delete-match/delete-match.component';
import { PlayerComponent } from './modals/player/player.component';

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
    LoginComponent,
    AvailabilityComponent,
    AddTrainingComponent,
    DeleteTrainingComponent,
    AddMatchComponent,
    DeleteMatchComponent,
    PlayerComponent
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
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatSortModule
  ],
  providers: [
    MapService,
    PlayerService,
    MatchAvailabilityService,
    MatchService,
    RoomService,
    PresenceService,
    RankService,
    ProcessHTTPMsgService,
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginComponent,
    AvailabilityComponent,
    AddTrainingComponent,
    DeleteTrainingComponent,
    AddMatchComponent,
    DeleteMatchComponent,
    PlayerComponent
  ]
})
export class AppModule { }
