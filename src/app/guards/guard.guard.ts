import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {

  constructor(private router: Router){
  }

  async canActivate() {
    const datosUsuario = await sessionStorage.getItem('datos');
    if ( datosUsuario ) {
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }

}
