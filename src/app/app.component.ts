import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './auth.service';

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
