import { Component, Input, OnInit } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css','../home/home.component.scss']
})
export class DispatchComponent implements OnInit {
  @Input() instalation: string = ''
  @Input() user_id: string = ''
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  products: any = []
  data:any = []
  showDispatchForm = false
  searchQuery: string = ''
  despachos: any = []
  selectedProducts: { name: string, quantity: number,cod:string }[] = [];
  instalaciones: any = []
  instalacionSelected = ''
  productSelected = ''
  constructor(private service: Kera3Service) { }

  async ngOnInit() {
    this.despachos = await this.service.getDespachos();
    console.log(this.despachos);
    this.instalaciones = await this.service.getAllInstalaciones();
    this.instalaciones = this.instalaciones.filter((instalacion:any) => instalacion.codigo_instalacion !== this.instalation);
    this.organizeData();
  }
  organizeData(){
    for (let index = 0; index < this.despachos.length; index++) {
      const dataIndex = this.data.findIndex((dat: any) => dat.numero_movimiento === this.despachos[index]["codigo_movimiento"]);
      if(dataIndex === -1){
        this.data.push({
          encargado:this.despachos[index]["encargado"],
          numero_movimiento:this.despachos[index]["codigo_movimiento"],
          fecha_inicio:this.despachos[index]["fecha_inicio"],
          fecha_final:this.despachos[index]["fecha_inicio"],
          instalacion_emitente:this.despachos[index]["instalacion_emitente"],
          instalacion_receptora:this.despachos[index]["instalacion_receptora"],
          estado:this.despachos[index]["estado"],
          products:[{
            nombre_producto:this.despachos[index]["nombre_producto"],
            cantidad_producto:this.despachos[index]["cantidad_producto"]
          }]
        })
      }
      else{
        this.data[dataIndex].products.push({
          nombre_producto: this.despachos[index]["nombre_producto"],
          cantidad_producto: this.despachos[index]["cantidad_producto"]
        });
      }
    }
  }
  getDetails(dispatchData:any){
    let dispatchList = dispatchData.products;
    let htmlContent = `Encargado:${dispatchData.encargado}<ul>`;
    for (let dispatch of dispatchList) {
      htmlContent += `
        <li>Producto: ${dispatch.nombre_producto} Cantidad: ${dispatch.cantidad_producto}</li>
      `;
    }
    htmlContent+=`</ul>`;
    Swal.fire({
      title: 'Detalles despacho',
      html: htmlContent,
      confirmButtonText: 'OK'
    });
  }
  async whenSelectedInstalation() {
    this.products = await this.service.getProducts(this.instalacionSelected);
    for (let index = 0; index < this.products.length; index++) {
      if (this.products[index]["nombre_estado"]!=="DISPONIBLE"){
        this.products.splice(index);
      }
    }
    var dropdown2 = document.getElementById("productDropdown");
    var dropdown1 = document.getElementById("instalacionDropdown");
    if (this.instalacionSelected.length !== 0 && dropdown2!==null && dropdown1!==null) {
      dropdown2.removeAttribute("disabled");
      dropdown1.setAttribute("disabled", "disabled");
    } else if (dropdown2!==null && dropdown1!==null) {
      dropdown2.setAttribute("disabled", "disabled");
      dropdown1.removeAttribute("disabled");
    }
  }
  changePanelMode(){
    this.showDispatchForm = !this.showDispatchForm;
  }
  cancelSale() {
    // Reset form
    this.instalacionSelected = '';
    this.showDispatchForm = false;
    this.selectedProducts = [];
  }
  addProduct() {
    const quantityInput = document.getElementById('quantityInput') as HTMLInputElement;
    // Find the selected product based on codigo_producto
    const selectedProduct = this.products.find((product: { codigo_producto: any; }) => product.codigo_producto === this.productSelected);
    const val = parseInt(quantityInput.value, 10);
    if (this.productSelected!='' && val > 0 && selectedProduct) {
      this.selectedProducts.push({ name: selectedProduct.nombre_producto, quantity: parseInt(quantityInput.value,10),cod:this.productSelected });
      this.productSelected ='';
      quantityInput.value = '';
    }
  }
  removeProduct(i: number)
  {
    for (let index = 0; index < this.selectedProducts.length; index++) {
      var newArray: any[] = [];
      if(index != i)
      {
        newArray.push(this.selectedProducts[index]);
      }
      this.selectedProducts = newArray;
    }
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
  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }
  onSearch() {
    if (this.searchQuery !== "") {
      let rgx_search = new RegExp(this.searchQuery.toLocaleUpperCase(), 'i')
      this.data = []
      for (let index = 0; index < this.products.length; index++) {
        if (rgx_search.test(this.products[index]['nombre_producto'].toLocaleUpperCase())){
          this.data = [...this.data, this.products[index]]
        }
      }
    } else {
      this.data = this.products.slice(this.minIndex, this.maxIndex)
    }
  }
}
