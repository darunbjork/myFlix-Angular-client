import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    console.log('Fetching movies...');
    this.fetchApiData.getAllMovies().subscribe(
      (resp: any) => {
        console.log('Movies fetched:', resp);
        this.movies = resp;
      },
      (error: any) => {
        console.error('Error fetching movies:', error);
        this.snackBar.open('Something went wrong. Please try again later.', 'OK', { duration: 3000 });
      }
    );
  }
}
