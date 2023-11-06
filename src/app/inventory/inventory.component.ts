import { Component, OnInit,ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css','../home/home.component.scss']
})
export class InventoryComponent implements OnInit , OnChanges {
  categorias: any = []
  estados: any = []
  instalaciones:any = []

  dimens: any = []
  categoriaValue = 'all'
  estadoValue = '0'
  data:any = []
  fileterd:any = []
  searchQuery: string = ''
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  brands: any = []

  @Input() instalation: string = ''
  @Input({required:true}) products: any= []



  constructor(private service: Kera3Service,private changeDetectorRef: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.fileterd = this.products
    this.data = this.fileterd.slice(this.minIndex,this.maxIndex)
  }

  get totalPages(): number {
    try {
    return Math.ceil(this.fileterd.length / this.itemsPerPage);
    }catch(error){
      return 0
    }
  }

  async ngOnInit() {
    this.fileterd = this.products
    this.instalaciones = await this.service.getAllInstalaciones();
    this.data = this.fileterd.slice(this.minIndex,this.maxIndex)
    this.categorias = await this.service.getAllCategories()
    this.estados = await this.service.getAllStates()
    this.estados = this.estados.filter((estado: { codigo_estado: number; }) => estado.codigo_estado >= 7 && estado.codigo_estado <= 9); //fiter only the correct states
    this.brands = await this.service.getBrands()
    this.dimens = await this.service.getAllDimens()
  }

  returnFirstPage() {
    this.currentPage = 1
    this.maxIndex = this.itemsPerPage;
    this.minIndex = 0;
    this.data = this.fileterd.slice(this.minIndex, this.maxIndex)
  }
  returnLastPage() {
    this.currentPage = this.totalPages
    this.maxIndex = this.products.length;
    this.minIndex = this.products.length-this.itemsPerPage;
    this.data = this.fileterd.slice(this.minIndex, this.maxIndex)
  }
  nextPage() {
    if (this.currentPage !== this.totalPages){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.fileterd.slice(this.minIndex, this.maxIndex)
    }
  }
  prevPage() {
    if (this.currentPage !== 1) {
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.fileterd.slice(this.minIndex, this.maxIndex)
    }
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
      <p> linea: ${product.linea_nombre}</p>
      `
  } )
  }

  async insertingProduct () {
    var cat = `<option value="" disabled selected>Categoria</option>`
    var dime = `<option value="" disabled selected>Dimensional</option>`
    var place = `<option value="" disabled selected>Sucursal</option>`
    var brands = `<option value="" disabled selected>Linea</option>`
    for (let index = 0; index < this.dimens.length; index++) {
      dime = dime+`<option value="${this.dimens[index].codigo_dimensional}">${this.dimens[index].nombre_dimensional}</option>`
    }
    for (let index = 0; index < this.categorias.length; index++) {
      cat = cat+`<option value="${this.categorias[index].codigo_categoria}">${this.categorias[index].nombre_categoria}</option>`
    }
    for (let index = 0; index < this.brands.length; index++) {
      brands = brands+`<option value="${this.brands[index].id}">${this.brands[index].nombre}</option>`
    }
    Swal.fire({
      title: 'Agregar producto',
      html: `
        <input type="text" id="codigo" class="swal2-input" placeholder="Código">
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
        <input type="number" step=".01" id="precio" class="swal2-input" placeholder="Precio">
        <input type="text" id="descripcion" class="swal2-input" placeholder="Descripcion">
        <input type="text" id="cantidad" class="swal2-input" placeholder="Cantidad">
        <select class="uk-select" id="categoria" placeholder="Categoria">
          ${cat}
        </select>
        <select class="uk-select" id="unidad" placeholder="Unidad">
          ${dime}
        </select>
        <select class="uk-select" id="brand" placeholder="Linea">
          ${brands}
        </select>

      `,
      confirmButtonText: 'Ingrese nuevo producto',
      focusConfirm: false,
      preConfirm: () => {
        const codigo = (<HTMLInputElement>document.getElementById('codigo')).value;
        const nombre = (<HTMLInputElement>document.getElementById('nombre')).value;
        const precio = (<HTMLSelectElement>document.getElementById('precio')).value;
        const descripcion = (<HTMLSelectElement>document.getElementById('descripcion')).value;
        const indexCat = (<HTMLSelectElement>document.getElementById('categoria')).value;
        const indexDime = (<HTMLSelectElement>document.getElementById('unidad')).value;
        const indexLocacion = this.instalation;
        const cantidadN = (<HTMLSelectElement>document.getElementById('cantidad')).value;
        const brand = (<HTMLSelectElement>document.getElementById('brand')).value;
        return {
          codigo: codigo,
          nombre: nombre,
          categoria: indexCat,
          unidad: indexDime,
          precio: precio,
          descripcion: descripcion,
          cod_instalacion: indexLocacion,
          cantidad:cantidadN,
          brand: brand
        };
      }
    }).then( async (result) => {
      if (result.isConfirmed) {
        this.service.addProduct(result.value)
        setTimeout(()=> {
          this.service.addProductCategory(result.value)
          this.service.addInventoryRegister(result.value)
        }, 1000)
      }
      this.products = await this.service.getAllProducts()
      this.fileterd = await this.products
      this.data = await this.fileterd.slice(this.minIndex, this.maxIndex)
      this.changeDetectorRef.markForCheck();
    });
  }
  onFilterAndSearch() {
    if (this.searchQuery != ""){

    this.fileterd = this.products.filter((product: { nombre_producto: string; codigo_producto: string; codigo_categoria: string; codigo_estado: string; codigo_instalacion: string; }) => {
      // Apply search filter
      const rgxSearch = new RegExp(this.searchQuery, 'i');
      const isMatchingSearch = rgxSearch.test(product.nombre_producto.toUpperCase()) ||
                               rgxSearch.test(product.codigo_producto.toUpperCase());

      // Apply ngIf-like conditions
      const isMatchingCategoria = this.categoriaValue === product.codigo_categoria || this.categoriaValue === 'all';
      const isMatchingEstado = this.estadoValue == product.codigo_estado || this.estadoValue === '0';
      const isMatchingInstalacion = product.codigo_instalacion == this.instalation

      // Combine all conditions with logical AND
      return isMatchingSearch && isMatchingCategoria && isMatchingEstado && isMatchingInstalacion;
    });

    // Apply pagination or any other post-filtering logic
    this.data = this.fileterd.slice(this.minIndex, this.maxIndex);}
    else{
      this.fileterd = this.products.filter((product: { nombre_producto: string; codigo_producto: string; codigo_categoria: string; codigo_estado: string; codigo_instalacion: string; }) => {
        // Apply ngIf-like conditions
        const isMatchingCategoria = this.categoriaValue === product.codigo_categoria || this.categoriaValue === 'all';
        const isMatchingEstado = this.estadoValue == product.codigo_estado || this.estadoValue === '0';
        const isMatchingInstalacion = product.codigo_instalacion == this.instalation;

        // Combine all conditions with logical AND
        return isMatchingCategoria && isMatchingEstado && isMatchingInstalacion;
      });
       // Apply pagination or any other post-filtering logic
      this.data = this.fileterd.slice(this.minIndex, this.maxIndex);
    }
  }

}
