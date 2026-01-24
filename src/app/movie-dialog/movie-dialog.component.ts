import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  styleUrls: ['./movie-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
  ],
})
export class MovieDialogComponent {
  data = inject<{
    title: string;
    description: string;
}>(MAT_DIALOG_DATA);
}
