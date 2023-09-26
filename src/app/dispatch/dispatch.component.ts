import { Component, Input, OnInit } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css','../home/home.component.scss']
})
export class DispatchComponent implements OnInit {
  totalPages:number = 0
  instalations: any = []
  instalationValue = '0'
  instalationValue2 = '0'
  filteredData: any =[]
  pointers: number[] = []
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
    this.instalations = await this.service.getAllInstalaciones();
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
    this.despachos = this.data;
    this.totalPages = Math.ceil(this.despachos.length / this.itemsPerPage);
    if (this.totalPages === 0) {
        this.totalPages += 1;
    }
  }
  getDetails(dispatchData:any){
    let dispatchList = dispatchData.products;
    let htmlContent = `<ul>`;
    for (let dispatch of dispatchList) {
      htmlContent += `
        <li>Producto: ${dispatch.nombre_producto} Cantidad: ${dispatch.cantidad_producto}</li>
      `;
    }
    htmlContent+=`</ul>`;
    Swal.fire({
      title: 'Detalles Despacho',
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
  cancelarPedido() {
    // Reset form
    this.instalacionSelected = '';
    this.showDispatchForm = false;
    this.selectedProducts = [];
  }
  addProduct() {
    const quantityInput = document.getElementById('quantityInput') as HTMLInputElement;
    const indexProduct = this.products.findIndex((product:any) => product.codigo_producto === this.productSelected);
    if (parseInt(quantityInput.value,10) > this.products[indexProduct]["cantidad"]) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La cantidad de producto es mayor a la posible.'
      });
      return; // Don't proceed further
    }
    // Find the selected product based on codigo_producto
    const selectedProduct = this.products.find((product: { codigo_producto: any; }) => product.codigo_producto === this.productSelected);
    const val = parseInt(quantityInput.value, 10);
    if (this.productSelected!='' && val > 0 && selectedProduct) {
      this.selectedProducts.push({ name: selectedProduct.nombre_producto, quantity: parseInt(quantityInput.value,10),cod:this.productSelected });
      // Se remueve el producto ya seleccionado de la lista de los productos posibles.
      this.products = this.products.filter((products:any) => products.codigo_producto !== this.productSelected);
      this.productSelected ='';
      quantityInput.value = '';
    }
  }
  async removeProduct(i: number)
  {
    this.selectedProducts = this.selectedProducts.splice(i);
    this.products = await this.service.getProducts(this.instalacionSelected);
    for (let index = 0; index < this.products.length; index++) {
      if (this.products[index]["nombre_estado"]!=="DISPONIBLE"){
        this.products.splice(index);
      }
      if (this.products[index]["codigo_producto"]===this.selectedProducts[index]["cod"])
      {
        this.products.splice(index);
      }
    }
  }//pagination
  returnFirstPage() {
    if (this.searchQuery.length === 0){
      this.currentPage = 1
      this.maxIndex = this.itemsPerPage;
      this.minIndex = 0;
      this.data = this.despachos.slice(this.minIndex,this.maxIndex)
    }
    else {
      this.currentPage = 1
      this.maxIndex = this.itemsPerPage;
      this.minIndex = 0;
      this.data = this.filteredData.slice(this.minIndex,this.maxIndex)
    }
  }
  returnLastPage() {
    if (this.searchQuery.length===0){
      this.currentPage = this.totalPages
      this.maxIndex = this.despachos.length;
      if ((this.despachos.length-this.itemsPerPage)%this.itemsPerPage===0){
        this.minIndex = this.despachos.length-this.itemsPerPage;
      }
      else {
        this.minIndex = this.despachos.length-1;
        while (this.minIndex%this.itemsPerPage) {
          this.minIndex -=1
        }
      }
      this.data = this.despachos.slice(this.minIndex,this.maxIndex)
    }
    else {
      this.currentPage = this.totalPages
      this.maxIndex = this.despachos.length;
      if ((this.filteredData.length-this.itemsPerPage)%this.itemsPerPage===0){
        this.minIndex = this.filteredData.length-this.itemsPerPage;
      }
      else {
        this.minIndex = this.filteredData.length-1;
        while (this.minIndex%this.itemsPerPage) {
          this.minIndex -=1
        }
      }
      this.data = this.filteredData.slice(this.minIndex,this.maxIndex)
    }
  }
  nextPage() {
    if (this.currentPage !== this.totalPages && this.searchQuery.length===0){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.despachos.slice(this.minIndex, this.maxIndex)
    }
    else if (this.currentPage !== this.totalPages){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.filteredData.slice(this.minIndex, this.maxIndex);
    }
  }
  prevPage() {
    if (this.currentPage !== 1 && this.searchQuery.length===0) {
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.despachos.slice(this.minIndex, this.maxIndex)
    }
    else if (this.currentPage !== 1){
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.filteredData.slice(this.minIndex, this.maxIndex);
    }
  }

  //filters
  onSearch() {
    const rgxSearch = new RegExp(this.searchQuery, 'i');
    if (this.searchQuery !== "") {
      this.filteredData = this.despachos.filter((despacho: { encargado: string;}) => {
        return (
          (rgxSearch.test(despacho.encargado) )
        );
      });
      if (this.pointers.length === 0) {
        this.pointers = [this.currentPage, this.minIndex, this.maxIndex, this.totalPages]
        this.currentPage = 1;
        this.despachos = Math.ceil(this.filteredData.length / this.itemsPerPage)
        this.minIndex = 0
        this.maxIndex = this.itemsPerPage
      }
      if (this.filteredData.length<=this.itemsPerPage){
        this.data = this.filteredData
      }
      else {
        this.data = this.filteredData.slice(this.minIndex, this.maxIndex);
        this.currentPage = 1
      }
    } else {
      this.filteredData = this.despachos;
      this.currentPage = this.pointers[0];
      this.minIndex = this.pointers[1];
      this.maxIndex = this.pointers[2];
      this.totalPages = this.pointers[3];
      this.data = this.despachos.slice(this.minIndex, this.maxIndex);
      this.pointers = [];
    }
  }
  confirmDispatch() {
    // Check if selectedProducts array is empty
    if (this.selectedProducts.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No has seleccionado ningún producto.'
      });
      return; // Don't proceed further
    }
    if (this.instalacionSelected.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No has seleccionado ninguna instalacion.'
      });
      return; // Don't proceed further
    }
    // Check for invalid quantities in selectedProducts
    const invalidProducts = this.selectedProducts.filter(product => product.quantity <= 0);
    if (invalidProducts.length > 0) {
      const productNames = invalidProducts.map(product => product.name).join(', ');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Las siguientes productos tienen cantidades no válidas: ${productNames}`
      });
      return; // Don't proceed further
    }
    // If all checks pass, you can proceed with sending the information
    this.sendDispatchData();
  }
  sendDispatchData() {
    const quantityInput = document.getElementById('quantityInput') as HTMLInputElement;
    // Perform actions to send the sale data
    // You can send the data to your server or perform other operations here
    this.service.addDispatch(this.user_id,this.instalation, this.instalacionSelected, this.selectedProducts);
    // Reset form
    this.instalacionSelected = '';
    this.showDispatchForm = false;
    this.selectedProducts = [];
    quantityInput.value = ''
  }

}
