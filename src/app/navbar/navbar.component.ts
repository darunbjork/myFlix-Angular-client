import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

/**
 * @description
 * Component for the navigation bar.
 * Handles user logout and navigation.
 * 
 * @component
 * @example
 * <app-navbar></app-navbar>
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
  ],
})
export class NavbarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);


  /**
   * Logs out the user and navigates to the welcome page.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
