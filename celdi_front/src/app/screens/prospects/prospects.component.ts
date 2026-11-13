import { Component, Output, EventEmitter, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  User,
  Phone,
  Clock,
  Check,
  X,
  UserPlus
} from 'lucide-angular';
import { Router, RouterLink } from '@angular/router';
import { AttributionComponent } from '../attribution/attribution.component';
import { RechercheService } from '../../recherche.service';

export type Statut = 'NOUVEAU' | 'CONTACTE' | 'CLIENT' | 'PERDU';

export interface Prospect {
  id: number;
  nom: string;
  telephone?: string;
  email?: string;
  source?: string;
  statut: Statut;
  assignedTo?: number | null;
}

@Component({
  selector: 'app-prospects',
  standalone: true,
  imports: [
    LucideAngularModule,
    RouterLink,
    ReactiveFormsModule,
    AttributionComponent
  ],
  templateUrl: './prospects.component.html',
  styleUrl: './prospects.component.scss'
})
export class ProspectsComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private api = 'http://localhost:8080/api/prospects';
  recherche = inject(RechercheService);

  @Output() menuToggled = new EventEmitter<boolean>();

  readonly UserIcon = User;
  readonly PhoneIcon = Phone;
  readonly ClockIcon = Clock;
  readonly CheckIcon = Check;
  readonly XIcon = X;
  protected readonly UserPlus = UserPlus;

  prospects: Prospect[] = [];
  erreur = '';
  succes = '';
  role: string | null = null;
  idEnEdition: number | null = null;
  private assignationEnEdition: number | null = null;
  afficherAttribution = false;
  prospectAAttribuer: number | null = null;

  readonly statuts: Statut[] = ['NOUVEAU', 'CONTACTE', 'CLIENT', 'PERDU'];
  readonly libelles: Record<Statut, string> = {
    NOUVEAU: 'Nouveau',
    CONTACTE: 'Contacté',
    CLIENT: 'Client',
    PERDU: 'Perdu',
  };

  form = new FormGroup({
    nom: new FormControl('', Validators.required),
    telephone: new FormControl(''),
    email: new FormControl('', Validators.email),
    source: new FormControl(''),
    statut: new FormControl<Statut>('NOUVEAU'),
  });
  get peutSupprimer(): boolean {
    return this.role === 'admin' || this.role === 'responsable';
  }
  get prospectsFiltres(): Prospect[] {
    const terme = this.recherche.terme().trim().toLowerCase();
    if (!terme) return this.prospects;
    return this.prospects.filter((p) =>
      [p.nom, p.telephone, p.email, p.source].some((v) => (v ?? '').toLowerCase().includes(terme))
    );
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.role = localStorage.getItem('role');
      this.charger();
    }
  }

  charger(): void {
    this.http.get<Prospect[]>(this.api).subscribe({
      next: (liste) => {
        this.prospects = liste;
        this.erreur = '';
      },
      error: (e) => (this.erreur = e.error?.message || 'Impossible de charger les prospects'),
    });
  }

  enregistrer(): void {
    this.erreur = '';
    this.succes = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.erreur = this.form.controls.nom.invalid
        ? 'Le nom est obligatoire'
        : "L'email est invalide (exemple : nom@gmail.com)";
      return;
    }

    const modification = this.idEnEdition !== null;
    const requete = modification
      ? this.http.put<Prospect>(`${this.api}/${this.idEnEdition}`, {
          ...this.form.value,
          assignedTo: this.assignationEnEdition,
        })
      : this.http.post<Prospect>(this.api, this.form.value);

    requete.subscribe({
      next: () => {
        this.succes = modification ? 'Prospect modifié' : 'Prospect ajouté';
        this.annuler();
        this.charger();
      },
      error: (e) => (this.erreur = e.error?.message || 'Enregistrement impossible'),
    });
  }

  editer(p: Prospect): void {
    this.idEnEdition = p.id;
    this.assignationEnEdition = p.assignedTo ?? null;
    this.erreur = '';
    this.succes = '';
    this.form.reset({
      nom: p.nom,
      telephone: p.telephone ?? '',
      email: p.email ?? '',
      source: p.source ?? '',
      statut: p.statut,
    });
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  annuler(): void {
    this.idEnEdition = null;
    this.assignationEnEdition = null;
    this.form.reset({ nom: '', telephone: '', email: '', source: '', statut: 'NOUVEAU' });
  }

  supprimer(p: Prospect): void {
    if (!confirm(`Supprimer ${p.nom} ?`)) return;
    this.http.delete(`${this.api}/${p.id}`).subscribe({
      next: () => {
        this.prospects = this.prospects.filter((x) => x.id !== p.id);
        if (this.idEnEdition === p.id) this.annuler();
        this.succes = 'Prospect supprimé';
      },
      error: (e) => (this.erreur = e.error?.message || 'Suppression impossible'),
    });
  }
  ouvrirAttribution(id: number | null = null): void {
    this.prospectAAttribuer = id;
    this.afficherAttribution = true;
  }

  apresAttribution(): void {
    this.afficherAttribution = false;
    this.charger();
  }

  compter(statut: Statut): number {
    return this.prospects.filter((p) => p.statut === statut).length;
  }

  badgeClasse(statut: Statut): string {
    const classes: Record<Statut, string> = {
      NOUVEAU: 'badge-new',
      CONTACTE: 'badge-contacted',
      CLIENT: 'badge-client',
      PERDU: 'badge-lost',
    };
    return `badge ${classes[statut]}`;
  }
}
