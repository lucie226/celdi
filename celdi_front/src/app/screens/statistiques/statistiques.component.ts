import { Component, inject, EventEmitter, Output, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Phone } from 'lucide-angular';
import { Router } from '@angular/router';

type Statut = 'NOUVEAU' | 'CONTACTE' | 'CLIENT' | 'PERDU';

interface Prospect {
  id: number;
  nom: string;
  source?: string | null;
  statut: Statut;
  assignedTo?: number | null;
}

interface Utilisateur {
  id: number;
  nom: string;
  role: string;
}

interface OptionSource {
  cle: string;
  nom: string;
}

interface LigneSource {
  nom: string;
  nombre: number;
  pct: number;
  classe: string;
}

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [
    LucideAngularModule
  ],
  templateUrl: './statistiques.component.html',
  styleUrl: './statistiques.component.scss'
})
export class StatistiquesComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private api = 'http://localhost:8080/api';

  @Output() menuToggled = new EventEmitter<boolean>();
  protected readonly PhoneIcon = Phone;

  private tous: Prospect[] = [];
  private readonly classesSources = [
    'blue-rectangular', 'violet-rectangular', 'grey-rectangular', 'pink-rectangular'
  ];

  total = 0;
  comptes: Record<Statut, number> = { NOUVEAU: 0, CONTACTE: 0, CLIENT: 0, PERDU: 0 };
  taux = 0;
  lignesSources: LigneSource[] = [];
  derniereMiseAJour = '';

  sources: OptionSource[] = [];
  commerciaux: Utilisateur[] = [];
  sourceChoisie = '';
  commercialChoisi = '';
  peutFiltrerCommercial = false;

  erreur = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const role = localStorage.getItem('role');
    this.peutFiltrerCommercial = role === 'admin' || role === 'responsable';
    this.charger();
  }

  charger(): void {
    this.http.get<Prospect[]>(`${this.api}/prospects`).subscribe({
      next: (liste) => {
        this.tous = liste;
        this.sources = this.extraireSources(liste);
        this.erreur = '';
        this.calculer();
      },
      error: (e) => (this.erreur = e.error?.message || 'Impossible de charger les statistiques'),
    });
    if (this.peutFiltrerCommercial) {
      this.http.get<Utilisateur[]>(`${this.api}/utilisateurs`).subscribe({
        next: (users) => (this.commerciaux = users.filter((u) => u.role === 'commercial')),
        error: () => (this.commerciaux = []),
      });
    }
  }
  calculer(): void {
    let liste = this.tous;

    if (this.sourceChoisie) {
      liste = liste.filter((p) => this.cle(p.source) === this.sourceChoisie);
    }
    if (this.commercialChoisi) {
      const id = Number(this.commercialChoisi);
      liste = liste.filter((p) => p.assignedTo === id);
    }

    this.total = liste.length;
    this.comptes = { NOUVEAU: 0, CONTACTE: 0, CLIENT: 0, PERDU: 0 };
    liste.forEach((p) => {
      if (p.statut in this.comptes) this.comptes[p.statut]++;
    });

    this.taux = this.total === 0 ? 0 : Math.round((this.comptes.CLIENT * 1000) / this.total) / 10;
    this.lignesSources = this.grouperParSource(liste);
    this.derniereMiseAJour = new Date().toLocaleString('fr-FR');
  }
  pct(nombre: number): number {
    return this.total === 0 ? 0 : Math.round((nombre * 100) / this.total);
  }

  get actifs(): number {
    return this.comptes.NOUVEAU + this.comptes.CONTACTE;
  }

  private cle(source?: string | null): string {
    return (source ?? '').trim().toLowerCase() || 'non-renseignee';
  }

  private nomSource(source?: string | null): string {
    return (source ?? '').trim() || 'Non renseignée';
  }

  private extraireSources(liste: Prospect[]): OptionSource[] {
    const map = new Map<string, string>();
    liste.forEach((p) => {
      const k = this.cle(p.source);
      if (!map.has(k)) map.set(k, this.nomSource(p.source));
    });
    return Array.from(map, ([cle, nom]) => ({ cle, nom }));
  }

  private grouperParSource(liste: Prospect[]): LigneSource[] {
    const map = new Map<string, { nom: string; nombre: number }>();
    liste.forEach((p) => {
      const k = this.cle(p.source);
      const ligne = map.get(k) ?? { nom: this.nomSource(p.source), nombre: 0 };
      ligne.nombre++;
      map.set(k, ligne);
    });
    return Array.from(map.values())
      .sort((a, b) => b.nombre - a.nombre)
      .map((l, i) => ({
        ...l,
        pct: this.pct(l.nombre),
        classe: this.classesSources[i % this.classesSources.length],
      }));
  }
}
