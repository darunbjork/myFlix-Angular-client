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
    console.log('Login credentials:', credentials);
    return this.http.post<any>(`${apiUrl}login?Username=${Username}&Password=${Password}`, credentials).pipe(
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
    return this.http.get<Response>(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    }).pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  

  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Error Status code ${error.status}, ` + `Error body is: ${JSON.stringify(error.error)}`);
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
