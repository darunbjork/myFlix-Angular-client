// src/app/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getFavoriteMovies();
  }

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
  
  editProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

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

  removeFavorite(movieID: string): void {
    this.fetchApiData.removeFavoriteMovie(movieID).subscribe(() => {
      this.favoriteMovies = this.favoriteMovies.filter(movie => movie._id !== movieID);
      this.snackBar.open('Movie removed from favorites!', 'OK', { duration: 2000 });
    }, (error) => {
      this.snackBar.open(`Error removing movie from favorites: ${error.message}`, 'OK', { duration: 2000 });
    });
  }
}
