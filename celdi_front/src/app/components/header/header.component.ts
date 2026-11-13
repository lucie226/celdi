import { Component, inject, Output, EventEmitter, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  LayoutDashboard,
  LucideAngularModule,
  Menu,
  Search,
  User,
} from 'lucide-angular';
import { RechercheService } from '../../recherche.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LucideAngularModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  recherche = inject(RechercheService);

  @Output() menuToggled = new EventEmitter<boolean>();
  isMenuCollapsed: boolean = false;

  // Utilisateur connecté
  nomUtilisateur = '';
  libelleRole = '';
  initiale = '';

  private readonly libellesRoles: Record<string, string> = {
    admin: 'Administrateur',
    responsable: 'Responsable',
    commercial: 'Commercial',
  };

  ngOnInit(): void {
    // Chaque nouvelle connexion repart d'une recherche vide
    this.recherche.terme.set('');

    // localStorage n'existe que dans le navigateur (pas côté serveur SSR)
    if (!isPlatformBrowser(this.platformId)) return;

    const role = localStorage.getItem('role') ?? '';
    this.libelleRole = this.libellesRoles[role] ?? '';

    try {
      this.nomUtilisateur = JSON.parse(localStorage.getItem('utilisateur') || 'null')?.nom ?? '';
    } catch {
      this.nomUtilisateur = '';
    }
    this.initiale = this.nomUtilisateur.charAt(0).toUpperCase();
  }

  get pageTitle(): string {
    const url = this.router.url;
    if (url.includes('utilisateur')) {
      return 'Gestion des utilisateurs';
    } else if (url.includes('prospects')) {
      return 'Gestion des prospects';
    } else if (url.includes('statistiques')) {
      return 'Statistiques';
    }
    return 'Tableau de bord';
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this.menuToggled.emit(this.isMenuCollapsed);
  }

  // La recherche porte sur les prospects : on la masque ailleurs
  get showSearch(): boolean {
    const url = this.router.url;
    return !url.includes('statistiques') && !url.includes('utilisateur');
  }

  // Touche Entrée : depuis le tableau de bord, on ouvre la liste des prospects
  validerRecherche(): void {
    if (!this.router.url.includes('prospects')) {
      this.router.navigate(['/prospects']);
    }
  }

  readonly Menu = Menu;
  readonly User = User;
  readonly Search = Search;
  protected readonly LayoutDashboard = LayoutDashboard;
}
