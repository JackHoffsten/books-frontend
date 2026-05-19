import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  protected themeService: ThemeService = inject(ThemeService);

  protected isMenuOpen: boolean = false;
  protected isUserMenuOpen: boolean = false;

  getUsername(): string {
    return this.authService.getUsername() || 'Användare';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isUserMenuOpen = false;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();

    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.closeMenu();
    this.authService.logout();
    this.router.navigate(['login'])
  }
}
