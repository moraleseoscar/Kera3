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
import { EmployeesComponent } from './employees/employees.component';
import { VentasComponent } from './ventas/ventas.component';
import { ComprasComponent } from './compras/compras.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AbonosComponent } from './abonos/abonos.component';


@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    NotFoundComponent,
    HomeComponent,
    DispatchComponent,
    ClientsComponent,
    InstalacionesComponent,
    LoginComponent,
    EmployeesComponent,
    VentasComponent,
    ComprasComponent,
    InventoryComponent,
    AbonosComponent
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
