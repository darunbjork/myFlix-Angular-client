import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

/**
 * @description
 * Component to display the synopsis of a movie in a dialog.
 * This component is used to show the synopsis of a movie.
 * 
 * @component
 * @example
 * <app-synopsis-dialog></app-synopsis-dialog>
 */
@Component({
  selector: 'app-synopsis-dialog',
  templateUrl: './synopsis-dialog.component.html',
  styleUrls: ['./synopsis-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
  ],
})
export class SynopsisDialogComponent {
  data = inject<{
    synopsis: string;
}>(MAT_DIALOG_DATA);
}
