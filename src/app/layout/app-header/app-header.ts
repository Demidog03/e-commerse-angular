import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './app-header.html',
  styleUrl: './app-header.scss',
})
export class AppHeader {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthed = computed(() => this.auth.isAuthenticated());

  onLogout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        // should not happen (logout() catches), but keep UX safe
        this.auth.logoutLocal();
        this.router.navigate(['/products']);
      }
    });
  }
}

