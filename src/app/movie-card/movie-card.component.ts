import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';

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
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  /**
   * Array to store the list of movies.
   * @type {any[]}
   */
  movies: any[] = [];

  /**
   * Array to store the list of favorite movies.
   * @type {any[]}
   */
  favoriteMovies: any[] = [];

  /**
   * Constructor that injects required services.
   * @param {FetchApiDataService} fetchApiData - Service to fetch data from API.
   * @param {MatSnackBar} snackBar - Service to show snack bar notifications.
   * @param {MatDialog} dialog - Service to handle dialogs.
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

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
      (resp: any) => {
        this.movies = resp;
      },
      (error: any) => {
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
        (resp: any) => {
          this.favoriteMovies = resp;
        },
        (error) => {
          this.snackBar.open(`Error fetching favorite movies: ${error.message}`, 'OK', { duration: 2000 });
        }
      );
    }
  }

  /**
   * Toggles the favorite status of a movie.
   * Adds or removes the movie from the user's favorite movies list.
   * @param {any} movie - The movie to toggle favorite status.
   */
  toggleFavorite(movie: any): void {
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
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, {
      data: { name: genre.Name, description: genre.Description }
    });
  }

  /**
   * Opens a dialog to display director details.
   * @param {any} director - The director data.
   */
  openDirectorDialog(director: any): void {
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
