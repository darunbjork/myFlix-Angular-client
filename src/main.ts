import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { WelcomePageComponent } from './app/welcome-page/welcome-page.component';
import { MovieCardComponent } from './app/movie-card/movie-card.component';
import { UserProfileComponent } from './app/user-profile/user-profile.component';
import { UserEditComponent } from './app/user-edit/user-edit.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: MovieCardComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'edit-profile', component: UserEditComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideProtractorTestingSupport(),
  ]
}).catch(err => console.error(err));
