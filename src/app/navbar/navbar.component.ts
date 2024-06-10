import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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
})
export class NavbarComponent {
  /**
   * Constructor that injects required services.
   * @param {Router} router - The router for navigation.
   * @param {AuthService} authService - The authentication service.
   */
  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Logs out the user and navigates to the welcome page.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
