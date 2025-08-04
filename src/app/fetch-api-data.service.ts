import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const apiUrl = 'https://myflix-movie-app-3823c24113de.herokuapp.com/';

interface User {
  _id: string;
  Username: string;
  Email: string;
  Birthday: Date;
  FavoriteMovies: string[]; // Array of movie IDs
}

interface Movie {
  _id: string;
  Title: string;
  Description: string;
  Genre: {
    Name: string;
    Description: string;
  };
  Director: {
    Name: string;
    Bio: string;
    Birthday: Date;
    Deathday: Date;
  };
  ImagePath: string;
  Featured: boolean;
}

/**
 * @description
 * Service to handle API requests to the backend.
 * Provides methods for user registration, login, fetching movies, and managing user data.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  private http = inject(HttpClient);

  /**
   * BehaviorSubject to store user data.
   * @private
   * @type {BehaviorSubject<any>}
   */
  private userData = new BehaviorSubject<User | null>(null);

  /**
   * Observable for the current user data.
   * @type {Observable<User | null>}
   */
  currentUser = this.userData.asObservable();

  /**
   * BehaviorSubject to store movies list.
   * @private
   * @type {BehaviorSubject<Movie[]>}
   */
  private movies = new BehaviorSubject<Movie[]>([]);

  /**
   * Observable for the movies list.
   * @type {Observable<Movie[]>}
   */
  moviesList = this.movies.asObservable();

  /**
   * Registers a new user.
   * @param {any} userDetails - The user details.
   * @returns {Observable<any>} The response from the API.
   */
  public userRegistration(userDetails: User): Observable<User> {
    return this.http.post<User>(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }

  /**
   * Logs in a user.
   * @param {string} Username - The username.
   * @param {string} Password - The password.
   * @returns {Observable<{ user: User, token: string }>}
   */
  public loginUser(Username: string, Password: string): Observable<{ user: User, token: string }> {
    const credentials = { Username, Password };
    console.log('Login credentials:', credentials);  // Log credentials
    return this.http.post<{ user: User, token: string }>(`${apiUrl}login`, credentials).pipe(
      map((response) => {
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
  public getAllMovies(): Observable<Movie[]> {
    const token = localStorage.getItem('token');
    console.log('Fetching all movies with token:', token);
    return this.http
      .get<Movie[]>(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Fetches user data.
   * @param {string} username - The username.
   * @returns {Observable<User>} The response from the API.
   */
  public getUser(username: string): Observable<User> {
    const token = localStorage.getItem('token');
    return this.http.get<User>(`${apiUrl}users/${username}`, {
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
   * @returns {Observable<User>} The response from the API.
   */
  public addFavoriteMovie(movieID: string): Observable<User> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    return this.http.post<User>(`${apiUrl}users/${username}/movies/${movieID}`, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(catchError(this.handleError));
  }

  /**
   * Fetches the user's favorite movies.
   * @param {string} username - The username.
   * @returns {Observable<Movie[]>} The response from the API.
   */
  public getFavoriteMovies(username: string): Observable<Movie[]> {
    const token = localStorage.getItem('token');
    console.log(`Fetching favorite movies for ${username} with token ${token}`);
    return this.http.get<Movie[]>(`${apiUrl}users/${username}/movies`, {
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
   * @returns {Observable<User>} The response from the API.
   */
  public removeFavoriteMovie(movieID: string): Observable<User> {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    return this.http.delete<User>(`${apiUrl}users/${username}/movies/${movieID}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(catchError(this.handleError));
  }

  /**
   * Edits user data.
   * @param {User} userDetails - The user details.
   * @returns {Observable<User>} The response from the API.
   */
  public editUser(userDetails: User): Observable<User> {
    const storedUser = localStorage.getItem('user');
    const username = storedUser ? JSON.parse(storedUser).Username : null;
    const token = localStorage.getItem('token');
    return this.http
      .put<User>(`${apiUrl}users/${username}`, userDetails, {
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
  public deleteUser(username: string): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http
      .delete<void>(`${apiUrl}users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Extracts response data.
   * @private
   * @param {Response} res - The response.
   * @returns {T} The extracted data.
   */
  private extractResponseData<T>(res: Response): T {
    const body = res;
    return (body || {}) as T;
  }

  /**
   * Handles HTTP errors.
   * @private
   * @param {HttpErrorResponse} error - The HTTP error.
   * @returns {Observable<never>} The error message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
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
    return throwError(() => new Error(errorMessage));
  }
}
