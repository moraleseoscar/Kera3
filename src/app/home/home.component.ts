import { Component } from '@angular/core';
import { Kera3ServiceService } from '../services/kera3-service.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
<<<<<<< Updated upstream
export class HomeComponent {

  categorias: any = [];
  estados: any = [];
  products: any = [];
  categoriaValue = 'all';
  estadoValue = '0';
  nombre = '';

  constructor(private kera3Service: Kera3ServiceService){
    this.getCategorias();
    this.getEstados();
    this.getAllProducts();
    setTimeout(() => {
      this.hola();
    }, 10000);
=======
export class HomeComponent implements OnInit{
  categorias: any = []
  estados: any = []
  products: any = []
  dimens: any = []
  categoriaValue = 'all'
  estadoValue = '0'
  data:any = {}
  searchQuery: string = ''
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  currentDashboard: string = 'inv'
  constructor(private service: Kera3Service){}
  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  
  getAllProducts(){
    this.kera3Service.getAllProducts().subscribe((resp:any)=>{
      this.products = resp;
    });
    
  }

=======
  changeDashboard(name: string){
    this.currentDashboard = name
  }
>>>>>>> Stashed changes
}
