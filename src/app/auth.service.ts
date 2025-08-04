import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * @description
 * Service to handle authentication status.
 * Provides methods for login, logout, and checking authentication status.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * A BehaviorSubject to store the authentication status.
   * @private
   * @type {BehaviorSubject<boolean>}
   */
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  /**
   * Constructor for the AuthService.
   */
  

  /**
   * Checks if the user is authenticated.
   * @returns {boolean} True if the user is authenticated, otherwise false.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Gets the authentication status as an observable.
   * @returns {Observable<boolean>} The authentication status.
   */
  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  /**
   * Sets the authentication status to true.
   */
  login() {
    this.authStatus.next(true);
  }

  /**
   * Clears the local storage and sets the authentication status to false.
   */
  logout(): void {
    localStorage.clear();
    this.authStatus.next(false);
  }
}
