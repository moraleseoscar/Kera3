import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { DispatchComponent } from './dispatch/dispatch.component';
import { ClientsComponent } from './clients/clients.component';
import { InstalacionesComponent } from './instalaciones/instalaciones.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [				
    AppComponent,
    SettingsComponent,
    NotFoundComponent,
    HomeComponent,
    DispatchComponent,
    ClientsComponent,
    InstalacionesComponent,
    LoginComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
