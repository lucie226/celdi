import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, User, Phone, Clock, Check, X } from 'lucide-angular';
import { Router, RouterLink } from '@angular/router';

type Statut = 'NOUVEAU' | 'CONTACTE' | 'CLIENT' | 'PERDU';

interface Prospect {
  id: number;
  nom: string;
  telephone?: string;
  email?: string;
  source?: string;
  statut: Statut;
  assignedTo?: number | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  readonly UserIcon = User;
  readonly PhoneIcon = Phone;
  readonly ClockIcon = Clock;
  readonly CheckIcon = Check;
  readonly X = X;

  protected readonly User = User;
  total = 0;
  comptes: Record<Statut, number> = { NOUVEAU: 0, CONTACTE: 0, CLIENT: 0, PERDU: 0 };
  taux = 0;
  aSuivre: Prospect[] = [];
  nomUtilisateur = '';
  erreur = '';

  private readonly libelles: Record<Statut, string> = {
    NOUVEAU: 'Nouveau',
    CONTACTE: 'Contacté',
    CLIENT: 'Client',
    PERDU: 'Perdu',
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      this.nomUtilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null')?.nom ?? '';
    } catch {
      this.nomUtilisateur = '';
    }
    this.charger();
  }

  charger(): void {
    this.http.get<Prospect[]>('http://localhost:8080/api/prospects').subscribe({
      next: (liste) => {
        this.total = liste.length;
        this.comptes = { NOUVEAU: 0, CONTACTE: 0, CLIENT: 0, PERDU: 0 };
        liste.forEach((p) => {
          if (p.statut in this.comptes) this.comptes[p.statut]++;
        });
        this.taux = this.total === 0 ? 0 : Math.round((this.comptes.CLIENT * 1000) / this.total) / 10;
        const ordre: Record<Statut, number> = { NOUVEAU: 0, CONTACTE: 1, CLIENT: 2, PERDU: 3 };
        this.aSuivre = liste
          .filter((p) => p.statut === 'NOUVEAU' || p.statut === 'CONTACTE')
          .sort((a, b) => ordre[a.statut] - ordre[b.statut] || b.id - a.id)
          .slice(0, 5);

        this.erreur = '';
      },
      error: (e) => (this.erreur = e.error?.message || 'Impossible de charger le tableau de bord'),
    });
  }

  libelle(statut: string): string {
    return this.libelles[statut as Statut] ?? statut;
  }

  actionPour(statut: string): string {
    return statut === 'NOUVEAU' ? 'Appeler' : 'Relancer';
  }
}
