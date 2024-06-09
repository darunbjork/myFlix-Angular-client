// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor() {}

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getAuthStatus() {
    return this.authStatus.asObservable();
  }

  login() {
    this.authStatus.next(true);
  }

  logout(): void {
    localStorage.clear();
    this.authStatus.next(false);
  }
}
