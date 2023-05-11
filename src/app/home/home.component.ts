import { Component } from '@angular/core';
import { Kera3ServiceService } from '../services/kera3-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  categorias: any = [];
  estados: any = [];
  categoriaValue = 'all';
  estadoValue = 'all';

  constructor(private kera3Service: Kera3ServiceService){
    this.getCategorias();
    this.getEstados();
    setTimeout(() => {
      this.hola();
    }, 10000);
  }

  hola(){
    console.log(this.categoriaValue, this.estadoValue)
  }
  

  getCategorias(){
    this.kera3Service.getCategorias().subscribe((resp: any)=>{
      this.categorias = resp;
      console.log(resp)
    });
  }

  getEstados(){
    this.kera3Service.getEstados().subscribe((resp: any)=>{
      this.estados = resp;
    });
  }


}
