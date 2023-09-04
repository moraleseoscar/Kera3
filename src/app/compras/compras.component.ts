import { Component } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent {
  showBuyForm = false
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  data:any = []
  compras:any = []
  coso:any =[]
  paymentStates:string[]= ['UN SOLO PAGO','A PLAZOS']
  searchQuery: string = ''
  estadoValue = '0'
  clienteSelected = ''
  productSelected = ''
  paymentSelected = ''
  constructor(private service: Kera3Service) {}
  async ngOnInit() {
    this.compras = await this.service.getCompras();
    console.log(this.compras);
    this.organizeData();
    console.log(this.data);
  }
  getDetails(buyData:any){
    let buyList = buyData.products;
    let htmlContent = '<ul>';
    for (let compra of buyList) {
      htmlContent += `
        <li>Producto: ${compra.nombre_producto} Cantidad: ${compra.cantidad_producto}</dli>
      `;
    }
    htmlContent+=`</ul>`;
    Swal.fire({
      title: 'Detalles compra',
      html: htmlContent,
      confirmButtonText: 'OK'
    });
  }
  organizeData(){
    for (let index = 0; index < this.compras.length; index++) {
      const dataIndex = this.data.findIndex((dat: any) => dat.numero_movimiento === this.compras[index]["numero_movimiento"]);
      if(dataIndex === -1){
        this.data.push({
          numero_movimiento:this.compras[index]["numero_movimiento"],
          fecha_inicio:this.compras[index]["fecha_inicio"],
          instalacion_emitente:this.compras[index]["instalacion_emitente"],
          encargado:this.compras[index]["encargado"],
          monto_total:this.compras[index]["monto_total"],
          estado:this.compras[index]["estado"],
          products:[{
            nombre_producto:this.compras[index]["nombre_producto"],
            cantidad_producto:this.compras[index]["cantidad_producto"]
          }]
        })
      }
      else{
        this.data[dataIndex].products.push({
          nombre_producto: this.compras[index]["nombre_producto"],
          cantidad_producto: this.compras[index]["cantidad_producto"]
        });
      }
    }
  }
  changePanelMode(){
    this.showBuyForm = !this.showBuyForm;
  }
  returnFirstPage() {
    this.currentPage = 1
    this.maxIndex = this.itemsPerPage;
    this.minIndex = 0;
    this.data = this.compras.slice(this.minIndex,this.maxIndex)
  }
  returnLastPage() {
    this.currentPage = this.totalPages
    this.maxIndex = this.compras.length;
    this.minIndex = this.compras.length-this.itemsPerPage;
    this.data = this.compras.slice(this.minIndex,this.maxIndex)
  }
  nextPage() {
    if (this.currentPage !== this.totalPages){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.compras.slice(this.minIndex, this.maxIndex)
    }
  }
  prevPage() {
    if (this.currentPage !== 1) {
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.compras.slice(this.minIndex, this.maxIndex)
    }
  }
  get totalPages(): number {
    return Math.ceil(this.compras.length / this.itemsPerPage);
  }
  onSearch() {
    if (this.searchQuery !== "") {
      let rgx_search = new RegExp(this.searchQuery.toLocaleUpperCase(), 'i')
      this.data = []
      for (let index = 0; index < this.compras.length; index++) {
        if (rgx_search.test( this.compras[index]['nombres'].toLocaleUpperCase() ) || rgx_search.test( this.compras[index]['apellidos'].toLocaleUpperCase())){
          this.data = [...this.compras, this.compras[index]]
        }
      }
    } else {
      this.data = this.compras.slice(this.minIndex, this.maxIndex)
    }
  }
}
