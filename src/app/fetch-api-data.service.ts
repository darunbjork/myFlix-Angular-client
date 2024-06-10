import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const apiUrl = 'https://myflix-movie-app-3823c24113de.herokuapp.com/';

/**
 * @description
 * Service to handle API requests to the backend.
 * Provides methods for user registration, login, fetching movies, and managing user data.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  /**
   * BehaviorSubject to store user data.
   * @private
   * @type {BehaviorSubject<any>}
   */
  private userData = new BehaviorSubject<any>({});

  /**
   * Observable for the current user data.
   * @type {Observable<any>}
   */
  currentUser = this.userData.asObservable();

  /**
   * BehaviorSubject to store movies list.
   * @private
   * @type {BehaviorSubject<any>}
   */
  private movies = new BehaviorSubject<any>({});

  /**
   * Observable for the movies list.
   * @type {Observable<any>}
   */
  moviesList = this.movies.asObservable();

  /**
   * Constructor that injects HttpClient.
   * @param {HttpClient} http - The HTTP client.
   */
  constructor(private http: HttpClient) {}

  /**
   * Registers a new user.
   * @param {any} userDetails - The user details.
   * @returns {Observable<any>} The response from the API.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }

  /**
   * Logs in a user.
   * @param {string} Username - The username.
   * @param {string} Password - The password.
   * @returns {Observable<any>} The response from the API.
   */
  public loginUser(Username: string, Password: string): Observable<any> {
    const credentials = { Username, Password };
    console.log('Login credentials:', credentials);  // Log credentials
    return this.http.post<any>(`${apiUrl}login`, credentials).pipe(
      map((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Login failed: Invalid credentials');
          return throwError(() => new Error('Invalid username or password.'));
        } else {
          console.error('Login error:', error);
          return throwError(() => new Error('An error occurred during login. Please try again.'));
        }
      })
    );
  }

  /**
   * Fetches all movies.
   * @returns {Observable<any>} The response from the API.
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Fetching all movies with token:', token);
    return this.http
      .get<Response>(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetches user data.
   * @param {string} username - The username.
   * @returns {Observable<any>} The response from the API.
   */
  public getUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}users/${username}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Adds a movie to the user's list of favorite movies.
   * @param {string} movieID - The movie ID.
   * @returns {Observable<any>} The response from the API.
   */
  public addFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    return this.http.post(`${apiUrl}users/${username}/movies/${movieID}`, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(catchError(this.handleError));
  }

  /**
   * Fetches the user's favorite movies.
   * @param {string} username - The username.
   * @returns {Observable<any>} The response from the API.
   */
  public getFavoriteMovies(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(`Fetching favorite movies for ${username} with token ${token}`);
    return this.http.get<any>(`${apiUrl}users/${username}/movies`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(
      map((response) => {
        console.log('Response:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Removes a movie from the user's list of favorite movies.
   * @param {string} movieID - The movie ID.
   * @returns {Observable<any>} The response from the API.
   */
  public removeFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    return this.http.delete(`${apiUrl}users/${username}/movies/${movieID}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(catchError(this.handleError));
  }

  /**
   * Edits user data.
   * @param {any} userDetails - The user details.
   * @returns {Observable<any>} The response from the API.
   */
  public editUser(userDetails: any): Observable<any> {
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    const token = localStorage.getItem('token');
    return this.http
      .put<any>(`${apiUrl}users/${username}`, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a user.
   * @param {string} username - The username.
   * @returns {Observable<any>} The response from the API.
   */
  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .delete<any>(`${apiUrl}users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Extracts response data.
   * @private
   * @param {any} res - The response.
   * @returns {any} The extracted data.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * Handles HTTP errors.
   * @private
   * @param {HttpErrorResponse} error - The HTTP error.
   * @returns {Observable<never>} The error message.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, Error body is: ${JSON.stringify(error.error)}`);
    }
    let errorMessage = 'Something bad happened; please try again later.';
    if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: ' + JSON.stringify(error.error);
          break;
        case 401:
          errorMessage = 'Unauthorized: ' + JSON.stringify(error.error);
          break;
        case 404:
          errorMessage = 'Resource not found: ' + JSON.stringify(error.error);
          break;
        default:
          errorMessage = 'An unexpected error occurred.';
          break;
      }
    }
    return throwError(errorMessage);
  }
}
