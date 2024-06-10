import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
})
export class UserProfileComponent implements OnInit {
  /**
   * Object to store user data.
   * @type {any}
   */
  user: any = {};

  /**
   * Array to store the list of favorite movies.
   * @type {any[]}
   */
  favoriteMovies: any[] = [];

  /**
   * Constructor that injects required services.
   * @param {FetchApiDataService} fetchApiData - Service to fetch data from API.
   * @param {MatSnackBar} snackBar - Service to show snack bar notifications.
   * @param {Router} router - The router for navigation.
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

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
        (resp: any) => {
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
   * Fetches the user's favorite movies from the API.
   */
  getFavoriteMovies(): void {
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    if (username) {
      this.fetchApiData.getFavoriteMovies(username).subscribe(
        (resp: any) => {
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
