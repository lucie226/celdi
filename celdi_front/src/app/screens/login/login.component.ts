import { Component, inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private http = inject(HttpClient);

  @Output() menuToggled = new EventEmitter<boolean>();

  erreur = '';
  chargement = false;

  loginForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.erreur = '';
    this.chargement = true;
    const { email, password } = this.loginForm.value;

    this.http
      .post<any>('http://localhost:8080/api/auth/login', {
        email: email,
        motDePasse: password, 
      })
      .subscribe({
        next: (rep) => {
          localStorage.setItem('token', rep.token);
          localStorage.setItem('role', rep.utilisateur.role);
          localStorage.setItem('utilisateur', JSON.stringify(rep.utilisateur));
          this.chargement = false;
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.chargement = false;
          this.erreur =
            err.status === 401
              ? 'Email ou mot de passe incorrect'
              : 'Impossible de joindre le serveur';
        },
      });
  }
}
