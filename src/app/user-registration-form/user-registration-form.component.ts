import { Component, OnInit, Input, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
})
export class UserRegistrationFormComponent implements OnInit {
  fetchApiData = inject(FetchApiDataService);
  dialogRef = inject<MatDialogRef<UserRegistrationFormComponent>>(MatDialogRef);
  snackBar = inject(MatSnackBar);
  private router = inject(Router);

  /**
   * Input property to store user registration data.
   * @type {{ Username: string; Password: string; Email: string; Birthday: string }}
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  

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
