import { Component, inject, Output, EventEmitter, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  User,
  Users,
  UserPlus,
  UserCheck,
  Trash2
} from 'lucide-angular';

export type Role = 'admin' | 'commercial' | 'responsable';

export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: Role;
}

@Component({
  selector: 'app-utilisateur',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './utilisateur.component.html',
  styleUrl: './utilisateur.component.scss'
})
export class UtilisateurComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private api = 'http://localhost:8080/api/utilisateurs';

  @Output() menuToggled = new EventEmitter<boolean>();
  readonly User = User;
  readonly Users = Users;
  readonly UserPlus = UserPlus;
  readonly UserCheck = UserCheck;
  readonly Trash2 = Trash2;

  utilisateurs: Utilisateur[] = [];
  erreur = '';
  succes = '';
  roleConnecte: string | null = null;
  monId: number | null = null;
  idEnEdition: number | null = null;

  readonly roles: Role[] = ['admin', 'commercial', 'responsable'];
  readonly libelles: Record<Role, string> = {
    admin: 'Administrateur',
    commercial: 'Commercial',
    responsable: 'Responsable',
  };

  form = new FormGroup({
    nom: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    motDePasse: new FormControl('', Validators.minLength(6)),
    confirmation: new FormControl(''),
    role: new FormControl<Role>('commercial'),
  });

  get estAdmin(): boolean {
    return this.roleConnecte === 'admin';
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.roleConnecte = localStorage.getItem('role');
    try {
      this.monId = JSON.parse(localStorage.getItem('utilisateur') || 'null')?.id ?? null;
    } catch {
      this.monId = null;
    }
    this.charger();
  }

  charger(): void {
    this.http.get<Utilisateur[]>(this.api).subscribe({
      next: (liste) => {
        this.utilisateurs = liste;
        this.erreur = '';
      },
      error: (e) => (this.erreur = this.message(e, 'Impossible de charger les utilisateurs')),
    });
  }

  enregistrer(): void {
    this.erreur = '';
    this.succes = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const c = this.form.controls;
      if (c.nom.invalid) this.erreur = 'Le nom est obligatoire';
      else if (c.email.invalid) this.erreur = "L'email est invalide (exemple : nom@gmail.com)";
      else if (c.motDePasse.invalid) this.erreur = 'Le mot de passe doit contenir au moins 6 caractères';
      else this.erreur = 'Le formulaire est incomplet';
      return;
    }
    const { confirmation, ...donnees } = this.form.value;

    if (this.idEnEdition === null && !donnees.motDePasse) {
      this.erreur = 'Le mot de passe est obligatoire (6 caractères minimum)';
      return;
    }
    if ((donnees.motDePasse || confirmation) && donnees.motDePasse !== confirmation) {
      this.erreur = 'Les mots de passe ne correspondent pas';
      return;
    }

    const requete =
      this.idEnEdition === null
        ? this.http.post<Utilisateur>(this.api, donnees)
        : this.http.put<Utilisateur>(`${this.api}/${this.idEnEdition}`, donnees);

    requete.subscribe({
      next: () => {
        this.succes = this.idEnEdition === null ? 'Utilisateur ajouté' : 'Utilisateur modifié';
        this.annuler();
        this.charger();
      },
      error: (e) => (this.erreur = this.message(e, 'Enregistrement impossible')),
    });
  }

  editer(u: Utilisateur): void {
    this.idEnEdition = u.id;
    this.erreur = '';
    this.succes = '';
    this.form.reset({ nom: u.nom, email: u.email, motDePasse: '', confirmation: '', role: u.role });
  }

  annuler(): void {
    this.idEnEdition = null;
    this.form.reset({ nom: '', email: '', motDePasse: '', confirmation: '', role: 'commercial' });
  }

  supprimer(u: Utilisateur): void {
    if (u.id === this.monId) {
      this.erreur = 'Tu ne peux pas supprimer ton propre compte';
      return;
    }
    if (!confirm(`Supprimer ${u.nom} ? Ses prospects redeviendront non assignés.`)) return;

    this.http.delete(`${this.api}/${u.id}`).subscribe({
      next: () => {
        this.succes = 'Utilisateur supprimé';
        this.utilisateurs = this.utilisateurs.filter((x) => x.id !== u.id);
      },
      error: (e) => (this.erreur = this.message(e, 'Suppression impossible')),
    });
  }

  compter(role: Role): number {
    return this.utilisateurs.filter((u) => u.role === role).length;
  }

  private message(e: any, defaut: string): string {
    const erreurs = e.error?.erreurs;
    if (erreurs) return Object.values(erreurs).join(' ; ');
    return e.error?.message || defaut;
  }
}
