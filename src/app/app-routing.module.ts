import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * @description
 * Defines the application routes.
 */
const routes: Routes = [];

/**
 * @description
 * The main routing module for the application.
 * Configures the RouterModule with the application routes.
 * 
 * @NgModule
 * @example
 * AppRoutingModule
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
