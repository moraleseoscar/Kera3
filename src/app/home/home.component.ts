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
   async insertingProduct () {
    var cat = `<option value="" disabled selected>Categoria</option>`
    var dime = `<option value="" disabled selected>Dimensional</option>`
    var indexDime = ""
    var indexCat = ""
    for (let index = 0; index < this.dimens.length; index++) {
      dime = dime+`<option [value]="${this.dimens[index].codigo_dimensional}">${this.dimens[index].nombre_dimensional}</option>`
      indexDime = this.dimens[index].codigo_dimensional
    }
    for (let index = 0; index < this.categorias.length; index++) {
      cat = cat+`<option [value]="${this.categorias[index].codigo_categoria}">${this.categorias[index].nombre_categoria}</option>`
      indexCat = this.categorias[index].codigo_categoria
    }
    Swal.fire({
      title: 'Agregar producto',
      html: `
        <input type="text" id="codigo" class="swal2-input" placeholder="Código">
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
        <input type="number" step=".01" id="precio" class="swal2-input" placeholder="Precio">
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
        const precio = (<HTMLSelectElement>document.getElementById('precio')).value;
        const descripcion = (<HTMLSelectElement>document.getElementById('descripcion')).value;
        return {
          codigo: codigo,
          nombre: nombre,
          categoria: indexCat,
          unidad: indexDime,
          precio: precio,
          descripcion: descripcion 
        };
      }
    }).then( async (result) => {
      if (result.isConfirmed) {
        this.service.addProduct(result.value)
        setTimeout(()=> {
          this.service.addProductCategory(result.value)
          this.service.addInventoryRegister(result.value)
        }, 1000)
        this.data = await this.service.getAllProducts()
        console.log(this.data)
      }
    });
  }
}
