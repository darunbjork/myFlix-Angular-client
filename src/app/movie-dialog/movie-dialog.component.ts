import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * @description
 * Component to display movie details in a dialog.
 * This component is used to show the movie's title and description.
 * 
 * @component
 * @example
 * <app-movie-dialog></app-movie-dialog>
 */
@Component({
  selector: 'app-movie-dialog',
  templateUrl: './movie-dialog.component.html',
  styleUrls: ['./movie-dialog.component.scss']
})
export class MovieDialogComponent {
  /**
   * Constructor that injects data into the dialog.
   * @param {any} data - The movie data passed to the dialog.
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; description: string }) {}
}
