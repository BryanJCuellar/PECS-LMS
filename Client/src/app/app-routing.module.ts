import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

// Components
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotFoundComponent } from './error/not-found/not-found.component';
import { ServerErrorComponent } from './error/server-error/server-error.component';

const scrollOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled', // or 'top'
  anchorScrolling: 'enabled',
  scrollOffset: [0, 64], // [x, y] - adjust scroll offset
  onSameUrlNavigation: 'reload'
};

const routes: Routes = [
  { path: '', component: LandingComponent, data: { title: 'PECS | LMS' } },
  { path: 'login', component: LoginComponent, data: { title: 'PECS LMS - Iniciar sesión' } },
  { path: 'login/:idUsuario/:codigo', component: LoginComponent, data: { title: 'Activación de Cuenta' } },
  { path: 'signup', component: SignupComponent, data: { title: 'PECS LMS - Registro' } },
  { path: 'signup/:idUsuario/:codigo', component: SignupComponent, data: { title: 'Registro exitoso' } },
  { path: 'dashboard', component: DashboardComponent, data: { title: 'Tablero' } },
  { path: '404', component: NotFoundComponent, data: { title: '404 Not Found' } },
  { path: '503', component: ServerErrorComponent, data: { title: '503 Service Unavailable' } },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, scrollOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
