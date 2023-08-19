import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2'
import { Kera3Service } from '../services/services.service';
import { ActivatedRoute , Router } from '@angular/router';
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
  userData : {user_nombres : string ;
                user_apellidos: string;
                codigo_instalacion: string;
                rol_interno: string;
                email: string}
              = {user_nombres :'username' , user_apellidos : 'last names',
              codigo_instalacion: '',
              rol_interno: 'USER ROL',
              email: 'mail'} //variable de info del usuario en sesion solo para lo visual en UI

  constructor(private service: Kera3Service , private route: ActivatedRoute, private router: Router , private changeDetectorRef: ChangeDetectorRef){

   }
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
    this.fetchInventory()
    this.service.subscribeToInvChanges()
    this.categorias = await this.service.getAllCategories()
    this.estados = await this.service.getAllStates()
    this.dimens = await this.service.getAllDimens()
    this.instalaciones = await this.service.getInstalaciones()
    let email = '';
    this.route.queryParams.subscribe(async params => {
      email = params['email'];
      console.log(Object.entries(params))
      let user = await this.service.getUserData(email)
      console.log(email);
      try{
        if(user !=null){
          console.log(user)
          this.userData= {user_nombres :user[0]['user_nombres'] , user_apellidos : user[0]['user_apellidos'],
          codigo_instalacion: user[0]['codigo_instalacion'],
          rol_interno: user[0]['rol_interno'],
          email: user[0]['email']}
          this.instalacionValue = user[0]['codigo_instalacion']
        }
      }catch (error){
      }
    });


  }
  //make the realtime data available
  async fetchInventory(): Promise<void> {
    try {
      this.products = await this.service.getAllProducts()
      this.data = await this.products.slice(this.minIndex, this.maxIndex)
    } catch (error) {
      console.error('Error fetching data:', error);
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
      <p> Ubicacion: ${product.codigo_instalacion}</p>
      `
  } )
  }
   async insertingProduct () {
    var cat = `<option value="" disabled selected>Categoria</option>`
    var dime = `<option value="" disabled selected>Dimensional</option>`
    var place = `<option value="" disabled selected>Sucursal</option>`
    var indexDime = ""
    var indexCat = ""
    for (let index = 0; index < this.dimens.length; index++) {
      dime = dime+`<option value="${this.dimens[index].codigo_dimensional}">${this.dimens[index].nombre_dimensional}</option>`
    }
    for (let index = 0; index < this.categorias.length; index++) {
      cat = cat+`<option value="${this.categorias[index].codigo_categoria}">${this.categorias[index].nombre_categoria}</option>`
    }
    for (let index = 0; index < this.instalaciones.length; index++) {
      place = place+`<option value="${this.instalaciones[index].codigo_instalacion}">${this.instalaciones[index].nombre_instalacion}</option>`
    }
    Swal.fire({
      title: 'Agregar producto',
      html: `
        <input type="text" id="codigo" class="swal2-input" placeholder="Código">
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
        <input type="number" step=".01" id="precio" class="swal2-input" placeholder="Precio">
        <input type="text" id="descripcion" class="swal2-input" placeholder="Descripcion">
        <input type="text" id="cantidad" class="swal2-input" placeholder="0">
        <select class="uk-select" id="categoria" placeholder="Categoria">
          ${cat}
        </select>
        <select class="uk-select" id="unidad" placeholder="Unidad">
          ${dime}
        </select>
        <select class="uk-select" id="ubicacion" placeholder="Unidad">
          ${place}
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
        const indexLocacion = (<HTMLSelectElement>document.getElementById('ubicacion')).value;
        const cantidadN = (<HTMLSelectElement>document.getElementById('cantidad')).value;
        return {
          codigo: codigo,
          nombre: nombre,
          categoria: indexCat,
          unidad: indexDime,
          precio: precio,
          descripcion: descripcion,
          cod_instalacion: indexLocacion,
          cantidad:cantidadN
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
      this.data = await this.products.slice(this.minIndex, this.maxIndex)
      this.changeDetectorRef.markForCheck();
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
  logOut(){
    this.service.logOut();
    this.router.navigate(['/login']);
  }
}
