import { Component, OnInit, inject } from '@angular/core';
import { FetchApiDataService, User } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * @description
 * Component to handle user profile editing.
 * Allows users to view and update their profile information or delete their account.
 * 
 * @component
 * @example
 * <app-user-edit></app-user-edit>
 */
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  private fetchApiData = inject(FetchApiDataService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  /**
   * Object to store user data.
   * @type {any}
   */
  user: User = {} as User;

  /**
   * Initializes the component.
   * Fetches user data.
   */
  ngOnInit(): void {
    this.getUser();
  }

  /**
   * Fetches the user's data from the API.
   */
  getUser(): void {
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    if (username) {
      this.fetchApiData.getUser(username).subscribe(
        (resp: User) => {
          this.user = resp;
          this.user.Birthday = new Date(this.user.Birthday).toISOString().substring(0, 10);
        },
        (error) => {
          this.snackBar.open(`Error fetching user data: ${error.message}`, 'OK', { duration: 2000 });
        }
      );
    }
  }

  /**
   * Updates the user's data.
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.user).subscribe(
      (resp: User) => {
        localStorage.setItem('user', JSON.stringify(resp));
        console.log('Updated user data:', localStorage.getItem('user'));  // Log updated user data
        this.snackBar.open('User updated successfully', 'OK', { duration: 2000 });
        this.router.navigate(['/profile']);
      },
      (error) => {
        this.snackBar.open(`Error updating user: ${error.message}`, 'OK', { duration: 2000 });
      }
    );
  }

  /**
   * Deletes the user's account.
   */
  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const storedUser = localStorage.getItem('user');
      const username = storedUser ? JSON.parse(storedUser).Username : null;
      if (username) {
        this.fetchApiData.deleteUser(username).subscribe(() => {
          localStorage.clear();
          this.snackBar.open('Account deleted successfully', 'OK', { duration: 2000 });
          this.router.navigate(['/welcome']); // Redirect to welcome page after deletion
        }, (error) => {
          this.snackBar.open(`Error deleting account: ${error.message}`, 'OK', { duration: 2000 });
        });
      }
    }
  }
}
