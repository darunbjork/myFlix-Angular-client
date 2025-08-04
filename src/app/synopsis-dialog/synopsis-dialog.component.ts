import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  styleUrls: ['./synopsis-dialog.component.scss']
})
export class SynopsisDialogComponent {
  data = inject<{
    synopsis: string;
}>(MAT_DIALOG_DATA);
}
