import { Component, Input } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent {
  instalations: any = []
  instalationValue = '0'
  filteredData: any =[]
  pointers: number[] = []
  validStateNames:string[] = ['CANCELADO', 'PENDIENTE DE PAGO', 'FINALIZADO'];
  totalPages = 0
  showBuyForm = false
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  selectedProducts: { name: string, quantity: number, monto:number, cod:string }[] = [];
  @Input() instalation: string = ''
  @Input() user_id: string = ''
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
    this.instalations = await this.service.getAllInstalaciones();
    this.compras = await this.service.getCompras();
    this.products = await this.service.getAllProducts();
    this.proveedores = await this.service.getProveedores();
    this.organizeData();
  }
  getDetails(buyData:any){
    let buyList = buyData.products;
    let htmlContent = `Proveedor:${buyData.nombre_proveedor}<ul>`;
    for (let compra of buyList) {
      htmlContent += `
        <li>${compra.nombre_producto}
          <ul>
            <li>Cantidad: ${compra.cantidad_producto}</li>
            <li>Precio: ${compra.monto_total}</li>
          </ul>
        </li>
      `;
    }
    htmlContent+=`</ul>`;
    Swal.fire({
      title: 'Detalles compra',
      html: htmlContent,
      confirmButtonText: 'OK'
    });
  }
  organizeData() {
    for (let index = 0; index < this.compras.length; index++) {
        const dataIndex = this.data.findIndex((dat: any) => dat.numero_movimiento === this.compras[index]["numero_movimiento"]);
        if (dataIndex === -1) {
            this.data.push({
                nombre_proveedor: this.compras[index]["nombre_proveedor"],
                numero_movimiento: this.compras[index]["numero_movimiento"],
                fecha_inicio: this.compras[index]["fecha_inicio"],
                instalacion_emitente: this.compras[index]["instalacion_emitente"],
                encargado: this.compras[index]["encargado"],
                monto_total: this.compras[index]["monto_total"],
                estado: this.compras[index]["estado"],
                products: [{
                    nombre_producto: this.compras[index]["nombre_producto"],
                    cantidad_producto: this.compras[index]["cantidad_producto"],
                    monto_total: this.compras[index]["monto_total"]
                }]
            });
        } else {
            // Find the existing product index in the products array
            const productIndex = this.data[dataIndex].products.findIndex((product: any) =>
                product.nombre_producto === this.compras[index]["nombre_producto"]
            );

            if (productIndex === -1) {
                // If the product doesn't exist in the products array, add it
                this.data[dataIndex].products.push({
                    nombre_producto: this.compras[index]["nombre_producto"],
                    cantidad_producto: this.compras[index]["cantidad_producto"],
                    monto_total: this.compras[index]["monto_total"]
                });
                // Adds the amount of the buy
                this.data[dataIndex].monto_total += this.compras[index]["monto_total"];
            } else {
                // If the product already exists, update its quantity or perform any other desired operation
                this.data[dataIndex].products[productIndex].cantidad_producto = this.compras[index]["cantidad_producto"];
            }
        }
    }
    this.compras = this.data;
    this.totalPages = Math.ceil(this.compras.length / this.itemsPerPage);
    if (this.totalPages === 0) {
        this.totalPages += 1;
    }
}

  confirmBuy() {
    // Check if clienteSelected is empty
    if (!this.proveedorSelected) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes seleccionar un proveedor.'
      });
      return; // Don't proceed further
    }
    const quantityInput = document.getElementById('montoInput') as HTMLInputElement;
    if (quantityInput.value.length===0){
      Swal.fire({icon:'warning',title:"Advertencia",text:`Ingresa el valor del pago.`});
      return;
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
    const quantityInput = document.getElementById('montoInput') as HTMLInputElement;
    // Perform actions to send the sale data
    // You can send the data to your server or perform other operations here
    this.service.addCompra(this.user_id,this.instalation, this.proveedorSelected , this.paymentSelected, this.selectedProducts, parseFloat(quantityInput.value));
    // Reset form
    this.paymentSelected = '';
    this.proveedorSelected = '';
    this.showBuyForm = false;
    this.selectedProducts = [];
    quantityInput.value = ''
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
    const montoInput = document.getElementById('montoInput') as HTMLInputElement;
    // Find the selected product based on codigo_producto
    const selectedProduct = this.products.find((product: { codigo_producto: any; }) => product.codigo_producto === this.productSelected);
    const val = parseInt(quantityInput.value, 10);
    const val2 = parseInt(montoInput.value, 10);
    if (this.productSelected!='' && val > 0 && val2>0 && selectedProduct) {
      this.selectedProducts.push({ name: selectedProduct.nombre_producto, quantity: parseInt(quantityInput.value,10),monto:parseInt(montoInput.value, 10),cod:this.productSelected });
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
  //pagination
  returnFirstPage() {
    if (this.searchQuery.length === 0){
      this.currentPage = 1
      this.maxIndex = this.itemsPerPage;
      this.minIndex = 0;
      this.data = this.compras.slice(this.minIndex,this.maxIndex)
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
      this.maxIndex = this.compras.length;
      if ((this.compras.length-this.itemsPerPage)%this.itemsPerPage===0){
        this.minIndex = this.compras.length-this.itemsPerPage;
      }
      else {
        this.minIndex = this.compras.length-1;
        while (this.minIndex%this.itemsPerPage) {
          this.minIndex -=1
        }
      }
      this.data = this.compras.slice(this.minIndex,this.maxIndex)
    }
    else {
      this.currentPage = this.totalPages
      this.maxIndex = this.compras.length;
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
      this.data = this.compras.slice(this.minIndex, this.maxIndex)
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
      this.data = this.compras.slice(this.minIndex, this.maxIndex)
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
      this.filteredData = this.compras.filter((compra: { encargado: string; nombre_proveedor: string; }) => {
        return (
          (rgxSearch.test(compra.encargado) || rgxSearch.test(compra.nombre_proveedor) )
        );
      });
      if (this.pointers.length === 0) {
        this.pointers = [this.currentPage, this.minIndex, this.maxIndex, this.totalPages]
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage)
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
      this.filteredData = this.compras;
      this.currentPage = this.pointers[0];
      this.minIndex = this.pointers[1];
      this.maxIndex = this.pointers[2];
      this.totalPages = this.pointers[3];
      this.data = this.compras.slice(this.minIndex, this.maxIndex);
      this.pointers = [];
    }
  }
}
