import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { Kera3Service } from '../services/services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  categorias: any = []
  estados: any = []
  instalaciones:any = []
  products: any = []
  dimens: any = []
  categoriaValue = 'all'
  instalacionValue = 'all'
  estadoValue = '0'
  data:any = []
  searchQuery: string = ''
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  navcurrent: string = 'inv' //variable de navegacion
  constructor(private service: Kera3Service){}
  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }
  get paginatedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.data = this.products.slice(startIndex, endIndex);
    console.log(this.products)
    return this.products.slice(startIndex, endIndex);
  }
  returnFirstPage() {
    this.currentPage = 1
    this.maxIndex = this.itemsPerPage;
    this.minIndex = 0;
    this.data = this.products.slice(this.minIndex,this.maxIndex)
  }
  returnLastPage() {
    this.currentPage = this.totalPages
    this.maxIndex = this.products.length;
    this.minIndex = this.products.length-this.itemsPerPage;
    this.data = this.products.slice(this.minIndex,this.maxIndex)
  }
  nextPage() {
    if (this.currentPage !== this.totalPages){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.products.slice(this.minIndex, this.maxIndex)
    }
  }
  prevPage() {
    if (this.currentPage !== 1) {
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.products.slice(this.minIndex, this.maxIndex)
    }
  }
  async ngOnInit(){
    this.products = await this.service.getAllProducts()
    this.data = await this.products.slice(this.minIndex, this.maxIndex)
    this.categorias = await this.service.getAllCategories()
    this.estados = await this.service.getAllStates()
    this.dimens = await this.service.getAllDimens()
    this.instalaciones = await this.service.getInstalaciones()
    
  }
  async getDetails(product : any){ //ver los detalles del producto
    Swal.fire({
      title: 'Detalles',
      html:`
      <p>${product.nombre_producto}</p>
      <p>${product.descripcion_producto}</p>
      <p>codigo: ${product.codigo_producto}</p>
      <p>Cantidad:  ${product.cantidad} ${product.codigo_dimensional}</p>
      <p class=${product.nombre_estado}>Estado: ${product.nombre_estado}</p>
      <p> precio: Q ${product.precio_producto}</p>
      `
  } )
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
        this.products = await this.service.getAllProducts()
        this.data = this.products
      }
    });
  }
  onSearch() {
    if (this.searchQuery !== "") {
      let rgx_search = new RegExp(this.searchQuery.toLocaleUpperCase(), 'i')
      this.data = []
      for (let index = 0; index < this.products.length; index++) {
        if (rgx_search.test(this.products[index]['nombre_producto'].toLocaleUpperCase()) || rgx_search.test(this.products[index]['codigo_producto'].toLocaleUpperCase())){
          this.data = [...this.data, this.products[index]]
        }
      }
    } else {
      this.data = this.products.slice(this.minIndex, this.maxIndex)
    }
  }
  setCurrentNav(panel :string){
    this.navcurrent = panel
  }
}
