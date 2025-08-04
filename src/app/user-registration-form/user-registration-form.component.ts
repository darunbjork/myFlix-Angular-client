import { Component, Input, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService, UserRegistrationData } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 * @description
 * Component for the user registration form.
 * Handles user registration and navigation.
 * 
 * @component
 * @example
 * <app-user-registration-form></app-user-registration-form>
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    RouterModule,
  ],
})
export class UserRegistrationFormComponent {
  fetchApiData = inject(FetchApiDataService);
  dialogRef = inject<MatDialogRef<UserRegistrationFormComponent>>(MatDialogRef);
  snackBar = inject(MatSnackBar);
  private router = inject(Router);

  /**
   * Input property to store user registration data.
   * @type {UserRegistrationData}
   */
  @Input() userData: UserRegistrationData = { Username: '', Password: '', Email: '', Birthday: '' };

  

  /**
   * Registers the user.
   * Closes the dialog and navigates to the welcome page.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      () => {
        this.dialogRef.close();
        this.snackBar.open('User registered successfully! Please log in.', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['welcome']); // Redirect to welcome page for login
      },
      (error) => {
        this.snackBar.open(error, 'OK', { duration: 2000 });
      }
    );
  }
}
