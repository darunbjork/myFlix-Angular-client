import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { FetchApiDataService, User, Movie } from '../fetch-api-data.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

/**
 * @description
 * Component for the user profile.
 * Handles displaying user details, favorite movies, and provides options to edit profile or delete account.
 * 
 * @component
 * @example
 * <app-user-profile></app-user-profile>
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
})
export class UserProfileComponent implements OnInit {
  private fetchApiData = inject(FetchApiDataService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  /**
   * Object to store user data.
   * @type {any}
   */
  user: User = {} as User;

  /**
   * Array to store the list of favorite movies.
   * @type {Movie[]}
   */
  favoriteMovies: Movie[] = [];

  /**
   * Initializes the component.
   * Fetches user data and favorite movies.
   */
  ngOnInit(): void {
    this.getUser();
    this.getFavoriteMovies();
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
          this.user.Birthday = this.user.Birthday.substring(0, 10);
        },
        (error) => {
          this.snackBar.open(`Error fetching user data: ${error.message}`, 'OK', { duration: 2000 });
        }
      );
    }
  }

  /**
   * Fetches the user's favorite movies from the API.
   */
  getFavoriteMovies(): void {
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    if (username) {
      this.fetchApiData.getFavoriteMovies(username).subscribe(
        (resp: Movie[]) => {
          console.log(`Favorite movies for ${username}:`, resp);
          this.favoriteMovies = resp;
        },
        (error) => {
          console.error(`Error fetching favorite movies for ${username}:`, error);
          this.snackBar.open(`Error fetching favorite movies: ${error}`, 'OK', { duration: 2000 });
        }
      );
    } else {
      console.error('No username found in localStorage');
    }
  }

  /**
   * Navigates to the edit profile page.
   */
  editProfile(): void {
    this.router.navigate(['/edit-profile']);
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
          this.router.navigate(['/welcome']);
        }, (error) => {
          this.snackBar.open(`Error deleting account: ${error.message}`, 'OK', { duration: 2000 });
        });
      }
    }
  }

  /**
   * Removes a movie from the user's list of favorite movies.
   * @param {string} movieID - The ID of the movie to remove.
   */
  removeFavorite(movieID: string): void {
    this.fetchApiData.removeFavoriteMovie(movieID).subscribe(() => {
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieID);
      this.snackBar.open('Movie removed from favorites!', 'OK', { duration: 2000 });
    }, (error) => {
      this.snackBar.open(`Error removing movie from favorites: ${error.message}`, 'OK', { duration: 2000 });
    });
  }
}
