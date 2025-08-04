import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';

/**
 * @description
 * The main component of the application.
 * It handles the overall layout and authentication status.
 * 
 * @component
 * @example
 * <app-root></app-root>
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent], // Will add common modules here later
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);

  /**
   * The title of the application.
   * @type {string}
   */
  title = 'myFlix-Angular-client';

  /**
   * The authentication status of the user.
   * @type {boolean}
   */
  isAuthenticated = false;

  /**
   * Initializes the component.
   * Subscribes to the authentication status.
   */
  ngOnInit() {
    this.authService.getAuthStatus().subscribe((status) => {
      this.isAuthenticated = status;
    });
  }
}
