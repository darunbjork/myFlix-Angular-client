import { Component, inject } from '@angular/core';
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
  data = inject<{
    title: string;
    description: string;
}>(MAT_DIALOG_DATA);
}
