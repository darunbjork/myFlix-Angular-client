import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * @description
 * Component to display director details in a dialog.
 * This component is used to show the director's name, bio, birth, and death information.
 * 
 * @component
 * @example
 * <app-director-dialog></app-director-dialog>
 */
@Component({
  selector: 'app-director-dialog',
  templateUrl: './director-dialog.component.html',
  styleUrls: ['./director-dialog.component.scss']
})
export class DirectorDialogComponent {
  data = inject<{
    name: string;
    bio: string;
    birth: string;
    death: string | null;
}>(MAT_DIALOG_DATA);
}
