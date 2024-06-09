import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
const apiUrl = 'https://myflix-movie-app-3823c24113de.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  private userData = new BehaviorSubject<any>({});
  currentUser = this.userData.asObservable();
  private movies = new BehaviorSubject<any>({});
  moviesList = this.movies.asObservable();
  constructor(private http: HttpClient) {}

  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }
  
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

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

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
