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
  selectedProducts: { name: string, quantity: number,cod:string }[] = [];
  data:any = []
  compras:any = []
  products:any =[]
  proveedores:any =[]
  paymentStates:string[]= ['UN SOLO PAGO','A PLAZOS']
  searchQuery: string = ''
  estadoValue = '0'
  proveedorSelected = ''
  productSelected = ''
  paymentSelected = ''
  constructor(private service: Kera3Service) {}
  async ngOnInit() {
    this.compras = await this.service.getCompras();
    this.products = await this.service.getAllProducts();
    this.proveedores = await this.service.getProveedores();
    this.organizeData();
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
  confirmSale() {
    // Check if clienteSelected is empty
    if (!this.proveedorSelected) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes seleccionar un proveedor.'
      });
      return; // Don't proceed further
    }

    // Check if selectedProducts array is empty
    if (this.selectedProducts.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No has seleccionado ningún producto.'
      });
      return; // Don't proceed further
    }
    if(this.paymentSelected == ''){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No has seleccionado ningún tipo de pago'
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
    this.sendBuyData();
  }
  sendBuyData() {
    // Perform actions to send the sale data
    // You can send the data to your server or perform other operations here
    // this.service.addCompra(this.user_id,this.instalation, this.clienteSelected , this.paymentSelected, this.selectedProducts);
    // Reset form
    this.paymentSelected = '';
    this.proveedorSelected = '';
    this.showBuyForm = false;
    this.selectedProducts = [];
  }
  cancelSale() {
    // Reset form
    this.paymentSelected = '';
    this.proveedorSelected = '';
    this.showBuyForm = false;
    this.selectedProducts = [];
  }
  changePanelMode(){
    this.showBuyForm = !this.showBuyForm;
  }
  // Method to add a product to selectedProducts array
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
