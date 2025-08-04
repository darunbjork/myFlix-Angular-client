import { Component, OnInit, Input, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * @description
 * Component for the user login form.
 * Handles user login and navigation.
 * 
 * @component
 * @example
 * <app-user-login-form></app-user-login-form>
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  fetchApiData = inject(FetchApiDataService);
  dialogRef = inject<MatDialogRef<UserLoginFormComponent>>(MatDialogRef);
  snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private authService = inject(AuthService);

  /**
   * Input property to store user login data.
   * @type {{ Username: string; Password: string }}
   */
  @Input() userData = { Username: '', Password: '' };

  

  /**
   * Logs in the user.
   * Stores the token and user data in local storage.
   * Closes the dialog and navigates to the movies page.
   */
  loginUser(): void {
    this.fetchApiData.loginUser(this.userData.Username, this.userData.Password).subscribe(
      (result) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        this.authService.login();
        this.dialogRef.close();
        this.snackBar.open('User logged in successfully!', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (error) => {
        const errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.snackBar.open(errorMessage, 'OK', { duration: 2000 });
      }
    );
  }
}
