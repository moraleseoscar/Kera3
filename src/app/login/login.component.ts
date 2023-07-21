import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { Kera3Service } from '../services/services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  _email: string = ''
  _password: string = ''
  constructor(private service: Kera3Service , private router: Router) {

   }

  ngOnInit() {

  }
  async login_request() {
    if(this._email!='' && this._password!='' && this._password.length>=8) {
      let {data, error} = await this.service.login(this._email, this._password);
      if(error) {
        this.alert(error.message);
      }else{
        this.router.navigate(['/home'], { queryParams: {email: this._email}})
      }
    }else{
      if(this._email == ''){
        this.alert('Ingrese un email')
      }else if (this._password == ''){
        this.alert('Ingrese su contraseña')
      }else if (this._password.length<8){
        this.alert('La contraseña no puede ser menor a 8 caracteres')
      }
      else{
        this.alert('Ingrese sus credenciales')
      }
    }
  }
  private alert(string: string){
    Swal.fire({
      icon:'error',
      title: 'Error',
      text: string
    }
    )
  }

}
