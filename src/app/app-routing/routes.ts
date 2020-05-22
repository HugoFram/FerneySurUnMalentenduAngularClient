import { Routes } from '@angular/router';

import { NextMatchComponent } from '../next-match/next-match.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { ResultsComponent } from '../results/results.component';
import { RankingComponent } from '../ranking/ranking.component';
import { PresenceTrainingComponent } from '../presence-training/presence-training.component';
import { PresenceMatchComponent } from '../presence-match/presence-match.component';
import { TeamComponent } from '../team/team.component';


export const routes: Routes = [
    {path: 'next-match', component: NextMatchComponent},
    {path: 'calendar', component: CalendarComponent},
    {path: 'results', component: ResultsComponent},
    {path: 'ranking', component: RankingComponent},
    {path: 'presence-training', component: PresenceTrainingComponent},
    {path: 'presence-match', component: PresenceMatchComponent},
    {path: 'team', component: TeamComponent},
    {path: '', redirectTo: '/next-match', pathMatch: 'full'}
];