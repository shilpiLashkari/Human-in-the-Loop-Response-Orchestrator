import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IncidentDetailComponent } from './components/incident-detail/incident-detail.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'incident/:id', component: IncidentDetailComponent },
    { path: '**', redirectTo: '' }
];
