import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ProspectAttribuable {
  id: number;
  nom: string;
  assignedTo?: number | null;
}

interface Commercial {
  id: number;
  nom: string;
  role: string;
}

@Component({
  selector: 'app-attribution',
  standalone: true,
  imports: [],
  templateUrl: './attribution.component.html',
  styleUrl: './attribution.component.scss'
})
export class AttributionComponent implements OnInit {
  private http = inject(HttpClient);
  private api = 'http://localhost:8080/api';
  @Input() prospects: ProspectAttribuable[] = [];
  @Input() prospectId: number | null = null;   // prospect présélectionné (facultatif)
  @Output() fermer = new EventEmitter<void>();
  @Output() attribue = new EventEmitter<void>();

  commerciaux: Commercial[] = [];
  prospectChoisi: number | null = null;
  commercialChoisi: number | null = null;
  erreur = '';
  envoi = false;

  ngOnInit(): void {
    this.prospectChoisi = this.prospectId;
    this.commercialChoisi = this.prospects.find((p) => p.id === this.prospectId)?.assignedTo ?? null;

    this.http.get<Commercial[]>(`${this.api}/utilisateurs`).subscribe({
      next: (users) => (this.commerciaux = users.filter((u) => u.role === 'commercial')),
      error: (e) => (this.erreur = e.error?.message || 'Impossible de charger les commerciaux'),
    });
  }
  @HostListener('document:keydown.escape')
  onEchap(): void {
    this.fermer.emit();
  }

  nomCommercial(id?: number | null): string {
    return this.commerciaux.find((c) => c.id === id)?.nom ?? `n°${id}`;
  }

  choisirProspect(valeur: string): void {
    this.prospectChoisi = valeur ? Number(valeur) : null;
    this.commercialChoisi = this.prospects.find((p) => p.id === this.prospectChoisi)?.assignedTo ?? null;
  }

  choisirCommercial(valeur: string): void {
    this.commercialChoisi = valeur ? Number(valeur) : null;
  }

  attribuer(): void {
    if (this.prospectChoisi === null || this.commercialChoisi === null) return;

    this.envoi = true;
    this.erreur = '';
    this.http
      .put(`${this.api}/prospects/${this.prospectChoisi}/assignation`, { userId: this.commercialChoisi })
      .subscribe({
        next: () => {
          this.envoi = false;
          this.attribue.emit();
        },
        error: (e) => {
          this.envoi = false;
          this.erreur = e.error?.message || "L'attribution a échoué";
        },
      });
  }
}
