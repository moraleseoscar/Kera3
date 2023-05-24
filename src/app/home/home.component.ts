import { Component, OnInit } from '@angular/core';
import { Kera3ServiceService } from '../services/kera3-service.service';
import Swal from 'sweetalert2'
import { Kera3Service } from '../services/services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  categorias: any = [];
  estados: any = [];
  products: any = [];
  categoriaValue = 'all';
  estadoValue = '0';
  nombre = '';
  data:any = {}
  constructor(private kera3Service: Kera3ServiceService, private service: Kera3Service){
    this.getCategorias();
    this.getEstados();
    this.getAllProducts();
    setTimeout(() => {
      this.hola();
    }, 10000);
  }
  async ngOnInit(){
    this.data = await this.service.getAllProducts()
  }
  hola(){
    console.log(this.categoriaValue, this.estadoValue)
  }
  
  holamundo(){
    Swal.fire({
      title: 'Agregar producto',
      html: `<input type="text" id="codigo" class="swal2-input" placeholder="Código">
      <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
      <input type="text" id= "categoria" class="swal2-input" placeholder="Categoria">
      <input type="text" id= "unidad" class="swal2-input" placeholder="Unidad">`,
      confirmButtonText: 'Sign in',
      focusConfirm: false,
      preConfirm: () => {
        
      }
    }).then((result) => {
     
    })
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
  
  getAllProducts(){
    this.kera3Service.getAllProducts().subscribe((resp:any)=>{
      this.products = resp;
    });
    
  }

}
