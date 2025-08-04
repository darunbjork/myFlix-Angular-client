import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  styleUrls: ['./genre-dialog.component.scss']
})
export class GenreDialogComponent {
  data = inject<{
    name: string;
    description: string;
}>(MAT_DIALOG_DATA);
}
