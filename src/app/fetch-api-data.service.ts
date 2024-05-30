import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const apiUrl = 'https://flixster-movies-7537569b59ac.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  private userData = new BehaviorSubject<any>({});
  currentUser = this.userData.asObservable();
  private movies = new BehaviorSubject<any>({});
  moviesList = this.movies.asObservable();

  constructor(private http: HttpClient) {}

  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  public loginUser(Username: string, Password: string): Observable<any> {
    const credentials = { Username, Password };
    // Log credentials before sending the request
    console.log('Login credentials:', credentials);
    return this.http.post<any>(`${apiUrl}login?Username=${Username}&Password=${Password}`, credentials).pipe(
      map((response: any) => {
        localStorage.setItem('token', response.token);
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

  public getAllMovies(): Observable<any> {
    return this.http.get(apiUrl + 'movies', {
      headers: this.addAuthHeaders()
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getOneMovie(title: string): Observable<any> {
    return this.http.get(apiUrl + `movies/${title}`, {
      headers: this.addAuthHeaders()
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getDirector(name: string): Observable<any> {
    return this.http.get(apiUrl + `directors/${name}`, {
      headers: this.addAuthHeaders()
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getGenre(name: string): Observable<any> {
    return this.http.get(apiUrl + `genres/${name}`, {
      headers: this.addAuthHeaders()
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getUser(): Observable<any> {
    const username = localStorage.getItem('user');
    return this.http.get(apiUrl + `users/${username}`, {
      headers: this.addAuthHeaders()
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getFavoriteMovies(): Observable<any> {
    const username = localStorage.getItem('user');
    return this.http.get(apiUrl + `users/${username}/movies`, {
      headers: this.addAuthHeaders()
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public addFavoriteMovie(movieId: string): Observable<any> {
    const username = localStorage.getItem('user');
    return this.http.post(apiUrl + `users/${username}/movies/${movieId}`, {}, {
      headers: this.addAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  public editUser(userDetails: any): Observable<any> {
    const username = localStorage.getItem('user');
    return this.http.put(apiUrl + `users/${username}`, userDetails, {
      headers: this.addAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  public deleteUser(): Observable<any> {
    const username = localStorage.getItem('user');
    return this.http.delete(apiUrl + `users/${username}`, {
      headers: this.addAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const username = localStorage.getItem('user');
    return this.http.delete(apiUrl + `users/${username}/movies/${movieId}`, {
      headers: this.addAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  // Helper function to add authorization headers
  private addAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    } else {
      console.error('Token not found in localStorage');
      return new HttpHeaders();
    }
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, Error body is: ${JSON.stringify(error.error)}`);
      switch (error.status) {
        case 400:
          return throwError('Bad Request: ' + JSON.stringify(error.error));
        case 401:
          return throwError('Unauthorized: ' + JSON.stringify(error.error));
        case 404:
          return throwError('Resource not found: ' + JSON.stringify(error.error));
        default:
          return throwError('Something bad happened; please try again later.');
      }
    }
  }
}
