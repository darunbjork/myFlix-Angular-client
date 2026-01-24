import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FetchApiDataService, Movie } from '../fetch-api-data.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

/**
 * @description
 * Component to display movie cards.
 * Handles displaying movies, managing favorite movies, and opening dialogs for genre, director, and synopsis.
 * 
 * @component
 * @example
 * <app-movie-card></app-movie-card>
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class MovieCardComponent implements OnInit {
  private fetchApiData = inject(FetchApiDataService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  /**
   * Array to store the list of movies.
   * @type {any[]}
   */
  movies: Movie[] = [];

  /**
   * Array to store the list of favorite movies.
   * @type {Movie[]}
   */
  favoriteMovies: Movie[] = [];

  /**
   * Initializes the component.
   * Fetches movies and favorite movies.
   */
  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

  /**
   * Fetches all movies from the API.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe(
      (resp: Movie[]) => {
        this.movies = resp;
      },
      () => {
        this.snackBar.open('Something went wrong. Please try again later.', 'OK', { duration: 3000 });
      }
    );
  }

  /**
   * Fetches the favorite movies of the user from the API.
   */
  getFavoriteMovies(): void {
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    if (username) {
      this.fetchApiData.getFavoriteMovies(username).subscribe(
        (resp: Movie[]) => {
          this.favoriteMovies = resp;
        },
        () => {
          this.snackBar.open(`Error fetching favorite movies: Something went wrong.`, 'OK', { duration: 2000 });
        }
      );
    }
  }

  /**
   * Toggles the favorite status of a movie.
   * Adds or removes the movie from the user's favorite movies list.
   * @param {Movie} movie - The movie to toggle favorite status.
   */
  toggleFavorite(movie: Movie): void {
    if (this.isFavorite(movie._id)) {
      // Remove from favorites
      this.fetchApiData.removeFavoriteMovie(movie._id).subscribe(() => {
        this.favoriteMovies = this.favoriteMovies.filter(favMovie => favMovie._id !== movie._id);
        this.snackBar.open('Movie removed from favorites!', 'OK', { duration: 2000 });
      });
    } else {
      // Add to favorites
      this.fetchApiData.addFavoriteMovie(movie._id).subscribe(() => {
        this.favoriteMovies.push(movie);
        this.snackBar.open('Movie added to favorites!', 'OK', { duration: 2000 });
      });
    }
  }

  /**
   * Checks if a movie is in the user's list of favorite movies.
   * @param {string} movieID - The ID of the movie.
   * @returns {boolean} True if the movie is a favorite, false otherwise.
   */
  isFavorite(movieID: string): boolean {
    return this.favoriteMovies.some(movie => movie._id === movieID);
  }

  /**
   * Opens a dialog to display genre details.
   * @param {any} genre - The genre data.
   */
  openGenreDialog(genre: { Name: string; Description: string }): void {
    this.dialog.open(GenreDialogComponent, {
      data: { name: genre.Name, description: genre.Description }
    });
  }

  /**
   * Opens a dialog to display director details.
   * @param {any} director - The director data.
   */
  openDirectorDialog(director: { Name: string; Bio: string; Birth: string; Death: string | null }): void {
    this.dialog.open(DirectorDialogComponent, {
      data: { name: director.Name, bio: director.Bio, birth: director.Birth, death: director.Death }
    });
  }

  /**
   * Opens a dialog to display the synopsis of a movie.
   * @param {string} description - The synopsis of the movie.
   */
  openSynopsisDialog(description: string): void {
    this.dialog.open(SynopsisDialogComponent, {
      data: { synopsis: description }
    });
  }
}
