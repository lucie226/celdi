import { Routes } from '@angular/router';
import { LoginComponent } from './screens/login/login.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { UtilisateurComponent } from './screens/utilisateur/utilisateur.component';
import { AttributionComponent } from './screens/attribution/attribution.component';
import { ProspectsComponent } from './screens/prospects/prospects.component';
import { StatistiquesComponent } from './screens/statistiques/statistiques.component';
import { authGuard, roleGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'prospects', component: ProspectsComponent, canActivate: [authGuard] },
  { path: 'statistiques', component: StatistiquesComponent, canActivate: [authGuard] },
  { path: 'attribution', component: AttributionComponent, canActivate: [roleGuard('admin', 'responsable')] },
  { path: 'utilisateur', component: UtilisateurComponent, canActivate: [roleGuard('admin', 'responsable')] },
];
