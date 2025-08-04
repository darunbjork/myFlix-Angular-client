import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

/**
 * @description
 * Component to display genre details in a dialog.
 * This component is used to show the genre's name and description.
 * 
 * @component
 * @example
 * <app-genre-dialog></app-genre-dialog>
 */
@Component({
  selector: 'app-genre-dialog',
  templateUrl: './genre-dialog.component.html',
  styleUrls: ['./genre-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
  ],
})
export class GenreDialogComponent {
  data = inject<{
    name: string;
    description: string;
}>(MAT_DIALOG_DATA);
}
