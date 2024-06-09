import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { SynopsisDialogComponent } from '../synopsis-dialog/synopsis-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies();
  }

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

  isFavorite(movieID: string): boolean {
    return this.favoriteMovies.some(movie => movie._id === movieID);
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, {
      data: { name: genre.Name, description: genre.Description }
    });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, {
      data: { name: director.Name, bio: director.Bio, birth: director.Birth, death: director.Death }
    });
  }

  openSynopsisDialog(description: string): void {
    this.dialog.open(SynopsisDialogComponent, {
      data: { synopsis: description }
    });
  }
}
