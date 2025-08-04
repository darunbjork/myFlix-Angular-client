import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

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
  styleUrls: ['./director-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
  ],
})
export class DirectorDialogComponent {
  data = inject<{
    name: string;
    bio: string;
    birth: string;
    death: string | null;
}>(MAT_DIALOG_DATA);
}
