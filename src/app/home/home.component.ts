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
  dimens: any = [];
  categoriaValue = 'all';
  estadoValue = '0';
  nombre = '';
  data:any = {}
  constructor(private kera3Service: Kera3ServiceService, private service: Kera3Service){}
  async ngOnInit(){
    this.data = await this.service.getAllProducts()
    this.categorias = await this.service.getAllCategories()
    this.dimens = await this.service.getAllDimens()
  }
  
  insertingProduct() {
    var cat = `<option value="" disabled selected>Categoria</option>`
    var dime = `<option value="" disabled selected>Dimensional</option>`
    for (let index = 0; index < this.dimens.length; index++) {
      dime = dime+`<option [value]="${this.dimens[index].codigo_dimensional}">${this.dimens[index].nombre_dimensional}</option>`; 
    }
    for (let index = 0; index < this.categorias.length; index++) {
      cat = cat+`<option [value]="${this.categorias[index].codigo_categoria}">${this.categorias[index].nombre_categoria}</option>`; 
    }
    Swal.fire({
      title: 'Agregar producto',
      html: `
        <input type="text" id="codigo" class="swal2-input" placeholder="Código">
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
        <input type="text" id="precio" class="swal2-input" placeholder="Precio">
        <input type="text" id="descripcion" class="swal2-input" placeholder="Descripcion">
        <select class="uk-select" id="categoria" placeholder="Categoria">
          ${cat}
        </select>
        <select class="uk-select" id="unidad" placeholder="Unidad">
          ${dime}
        </select>
      `,
      confirmButtonText: 'Ingrese nuevo producto',
      focusConfirm: false,
      preConfirm: () => {
        const codigo = (<HTMLInputElement>document.getElementById('codigo')).value;
        const nombre = (<HTMLInputElement>document.getElementById('nombre')).value;
        const categoria = (<HTMLSelectElement>document.getElementById('categoria')).value;
        const unidad = (<HTMLSelectElement>document.getElementById('unidad')).value;
        const precio = (<HTMLSelectElement>document.getElementById('precio')).value;
        const descripcion = (<HTMLSelectElement>document.getElementById('descripcion')).value;
        return {
          codigo: codigo,
          nombre: nombre,
          categoria: this.searchingIndexCategory(this.categorias, categoria),
          unidad: this.searchingIndexDimensional(this.dimens, unidad),
          precio: precio,
          descripcion: descripcion 
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.addProduct(result.value)
        this.service.addProductCategory(result.value)
      }
    });
  }
  searchingIndexDimensional(list:any, element:string){
    for (let index = 0; index < list.length; index++) {
      if (list[index]["nombre_dimensional"] == element ){
        return list[index]["codigo_dimensional"]
      }      
    }
    return null
  }
  searchingIndexCategory(list:any, element:string){
    for (let index = 0; index < list.length; index++) {
      if (list[index]["nombre_categoria"] == element ){
        return list[index]["codigo_categoria"]
      }      
    }
    return null
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
