import { Component, OnInit, Input } from '@angular/core';
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
  /**
   * Input property to store user registration data.
   * @type {{ Username: string; Password: string; Email: string; Birthday: string }}
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Constructor that injects required services.
   * @param {FetchApiDataService} fetchApiData - Service to fetch data from API.
   * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to the dialog.
   * @param {MatSnackBar} snackBar - Service to show snack bar notifications.
   * @param {Router} router - The router for navigation.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Initializes the component.
   */
  ngOnInit(): void {}

  /**
   * Registers the user.
   * Closes the dialog and navigates to the welcome page.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (result) => {
        this.dialogRef.close();
        this.snackBar.open('User registered successfully! Please log in.', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['welcome']); // Redirect to welcome page for login
      },
      (result) => {
        this.snackBar.open(result, 'OK', { duration: 2000 });
      }
    );
  }
}
