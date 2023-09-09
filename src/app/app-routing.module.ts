import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './login/login.component';
import { GuardGuard } from './guards/guard.guard';


const routes: Routes = [
  {canActivate: [GuardGuard], path: '', component: HomeComponent},
  {canActivate: [GuardGuard], path: 'settings', component: SettingsComponent},
  {path:'login', component: LoginComponent},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
