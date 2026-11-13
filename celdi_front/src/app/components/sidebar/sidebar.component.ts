import { Component, EventEmitter, Input, Output, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, BarChart3, Users, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  @Input() sidebarCollapsed = false;
  @Output() menuToggled = new EventEmitter<boolean>();

  readonly LayoutDashboard = LayoutDashboard;
  readonly BarChart3 = BarChart3;
  readonly Users = Users;
  readonly LogOut = LogOut;

  // Le commercial n'a pas accès à la gestion des utilisateurs
  peutVoirUtilisateurs = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const role = localStorage.getItem('role');
    this.peutVoirUtilisateurs = role === 'admin' || role === 'responsable';
  }

  basculer(): void {
    this.menuToggled.emit(!this.sidebarCollapsed);
  }

  onLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('utilisateur');
    this.router.navigate(['/login']);
  }
}
