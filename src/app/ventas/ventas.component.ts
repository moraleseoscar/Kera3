import {Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import { format } from 'date-fns';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss','../home/home.component.scss']
})
export class VentasComponent implements OnInit{
  //pagination
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  //data
  products:any[] = []

  data:any = []
  cart:any = []
  states:any = []
  filteredData: any =[]
  paymentStates:string[]= ['UN SOLO PAGO','A PLAZOS']
  // Define an array of names to filter
  validStateNames:string[] = ['CANCELADO', 'PENDIENTE DE PAGO', 'FINALIZADO'];
  pointers: number[] = []
  //filters
  searchQuery: string = ''
  estadoValue = '0'
  instalationValue = '0'
  //sale
  clienteSelected = '' //name
  _clienteSelected = '' //the code
  productSelected = ''
  paymentSelected = ''
  dateSelected = ''
  totalPages = 0
  //register a sale
  selectedProducts: { name: string, quantity: number,cod:string }[] = [];

  @Input() instalation: string = ''
  @Input() user_id: string = ''
  @Input() clients:any = []
  @Input({required:true}) sales: any = []

  showSaleForm: boolean = false;
  //real time handlers


  constructor(private service: Kera3Service) {}
  async ngOnInit() {
    this.data = this.sales;
    this.totalPages = (Math.ceil(this.sales.length / this.itemsPerPage));
    if (this.totalPages===0){
      this.totalPages+=1
    }
    this.products = await this.service.getAllProducts();
    this.products = this.products.filter(product =>{
      return product['codigo_instalacion'] ==this.instalation
    })

    // Filter the states array to include only the valid names
    this.states = this.states.filter((state: { nombre_estado: string; }) => this.validStateNames.includes(state.nombre_estado));
    this.states = await this.service.getAllStates();

  }
  selectClientCode() {
    //retreive the selected code

    let name = this.clienteSelected.split(' ');
    let id = this.clients.find((c: { nombres: string; apellidos: string; }) => c.nombres == name[0] && c.apellidos == name[1]);
    if (id) {
      this._clienteSelected = id.codigo_cliente;
    }else{
      Swal.fire('Error','Cliente no hallado','error');
    }
  }
  selectedProduct(prodCode: string){
    this.productSelected = prodCode;
  }
  changePanelMode(){
    this.showSaleForm = !this.showSaleForm
  }
  //details from the sale
  getDetails(saleData:any, date:any, nombre_estado: any){
    let nDate = new Date(date);
    let restDate = new Date();
    let result = Math.floor((nDate.getTime() - restDate.getTime())*1/1000*1/3600*1/24)
    let productList = '';
    saleData.products.forEach((product: { id: any; name: any; price: any; quantity:any; }) => {
      productList += `<tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.quantity}</td>
      <td>${product.price}</td>
      <td>${Number(product.price)*Number(product.quantity)}</td></tr>
      `;
      });
      if (result<0 && nombre_estado !== 'FINALIZADO'){
        let result = Math.floor((-nDate.getTime() + restDate.getTime())*1/1000*1/3600*1/24)
        Swal.fire({
          title: `Detalles venta a ${saleData.client_name}`,
          html: `
          <p>Fecha de vencimiento: ${date}</p>
          <p>SCrédito vencido hace: ${result} días</p>
          <p>Productos:</p>
          <table class="uk-table uk-table-large uk-table-striped uk-table-responsive">
            <thead>
                <tr>
                    <th class="uk-table-large">Codigo</th>
                    <th class="uk-table-large">Nombre</th>
                    <th class="uk-table-large">Cantidad</th>
                    <th class="uk-table-large">Precio</th>
                    <th class="uk-table-large">Subtotal</th>
                </tr>
            </thead>
            <tbody>
            ${productList}
            </tbody>
            </table>
          `,
          confirmButtonText: 'OK'
        });
      }
      else if (result > 0 && nombre_estado !== 'FINALIZADO'){
        Swal.fire({
          title: `Detalles venta a ${saleData.client_name}`,
          html: `
          <p>Fecha de vencimiento: ${date}</p>
          <p>Días Crédito Disponibles: ${result} días</p>
          <p>Productos:</p>
          <table class="uk-table uk-table-small uk-table-striped uk-table-responsive">
          <table class="uk-table uk-table-small uk-table-striped uk-table-responsive">
            <thead>
                <tr>
                    <th class="uk-table-small">Codigo</th>
                    <th class="uk-table-small">Nombre</th>
                    <th class="uk-table-small">Cantidad</th>
                    <th class="uk-table-small">Precio</th>
                    <th class="uk-table-small">Subtotal</th>
                </tr>
            </thead>
            <tbody>
            ${productList}
            </tbody>
            </table>
          `,
          confirmButtonText: 'OK'
        });
      }
      else{
        Swal.fire({
          title: `Detalles venta a ${saleData.client_name}`,
          html: `
          <p>Productos:</p>
          <table class="uk-table uk-table-small uk-table-striped uk-table-responsive">
            <thead>
                <tr>
                    <th class="uk-table-small">Codigo</th>
                    <th class="uk-table-small">Nombre</th>
                    <th class="uk-table-small">Cantidad</th>
                    <th class="uk-table-small">Precio</th>
                    <th class="uk-table-small">Subtotal</th>
                </tr>
            </thead>
            <tbody>
            ${productList}
            </tbody>
            </table>
          `,
          confirmButtonText: 'OK'
        });
      }
  }

  // Method to add a product to selectedProducts array
  addProduct() {
    const quantityInput = document.getElementById('quantityInput') as HTMLInputElement;
    // Find the selected product based on codigo_producto
    const selectedProduct = this.products.find(product => product.codigo_producto == this.productSelected);
    const val = parseInt(quantityInput.value, 10);
    if (this.productSelected!='' && val > 0 && selectedProduct) {
      this.selectedProducts.push({ name: selectedProduct.nombre_producto, quantity: parseInt(quantityInput.value,10),cod:this.productSelected });
      this.productSelected ='';
      quantityInput.value = '';
    }
  }
  removeProduct(i: number) {
    for (let index = 0; index < this.selectedProducts.length; index++) {
      var newArray: any[] = [];
      if(index != i)
      {
        newArray.push(this.selectedProducts[index]);
      }
      this.selectedProducts = newArray;
    }
  }
  confirmSale() {
    //obtener el código del cliente
    this.selectClientCode();
    // Check if clienteSelected is empty
    if (!this._clienteSelected) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes seleccionar un cliente.'
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
    if (this.paymentSelected==='A PLAZOS'){
      const quantityInput = document.getElementById('exactDate') as HTMLInputElement;
      this.dateSelected = quantityInput.value
      if (this.dateSelected.length===0){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No has seleccionado la fecha de vencimiento'
        });
        return; // Don't proceed further
      }
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
    this.sendSaleData();
  }

  // Method to cancel sale
  cancelSale() {
    // Reset form
    this.paymentSelected = '';
    this.clienteSelected = '';
    this.showSaleForm = false;
    this.selectedProducts = [];
    this.dateSelected = ''
  }
  //send the sale to database
  async sendSaleData() {
    // Perform actions to send the sale data
    // You can send the data to your server or perform other operations here
    if (this.paymentSelected!=='A PLAZOS') {
      const currentTimestamp = new Date();
      this.dateSelected = format(currentTimestamp, 'yyyy-MM-dd HH:mm:ss');
    }
    const res = await this.service.addVenta(this.user_id,this.instalation, this._clienteSelected , this.paymentSelected, this.selectedProducts, this.dateSelected)
    if ( res==true) {
      Swal.fire('Éxito','envió registrado','success');
    }
    // Reset form
    this.paymentSelected = '';
    this.clienteSelected = '';
    this._clienteSelected = '';
    this.showSaleForm = false;
    this.selectedProducts = [];
    this.dateSelected = '';
  }

  //payments of the sales
  getPayments(salePayments: any[], saleDebt: string){
    let paymentList = '';
    salePayments.forEach((salePayment) => {
      paymentList += `fecha realizado: ${salePayment.fecha_pago} Monto: Q${salePayment.monto_movimiento}`
    })
    Swal.fire({
      title: 'Registro de pagos realizados',
      html: `
      <p>Deuda esta venta: Q ${saleDebt}</p>
      <pre>${paymentList}</pre>
      `,
      confirmButtonText: 'OK'
    })
  }

  async addPayment(saleCode : string){
    Swal.fire({
      title: 'Registrar un pago',
      confirmButtonText: 'Registrar',
      showDenyButton: true,
      denyButtonText: `Cancelar`,
      input: 'number',
      inputLabel: 'Monto en Q',
      preConfirm: (payment) =>{
        const _payment = parseFloat(payment)
        if (!payment || _payment <=0 ){
          Swal.showValidationMessage(
            'Cantidad no válida'
          )
        }
      }
    }).then((result) => {
      if(result.isConfirmed){
        if (result.value){
          let res = this.service.addPayment(saleCode,result.value)
        }
      }
      })
  }
  //pagination
  returnFirstPage() {
    if (this.searchQuery.length === 0){
      this.currentPage = 1
      this.maxIndex = this.itemsPerPage;
      this.minIndex = 0;
      this.data = this.sales.slice(this.minIndex,this.maxIndex)
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
      this.maxIndex = this.sales.length;
      if ((this.sales.length-this.itemsPerPage)%this.itemsPerPage===0){
        this.minIndex = this.sales.length-this.itemsPerPage;
      }
      else {
        this.minIndex = this.sales.length-1;
        while (this.minIndex%this.itemsPerPage) {
          this.minIndex -=1
        }
      }
      this.data = this.sales.slice(this.minIndex,this.maxIndex)
    }
    else {
      this.currentPage = this.totalPages
      this.maxIndex = this.sales.length;
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
      this.data = this.sales.slice(this.minIndex, this.maxIndex)
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
      this.data = this.sales.slice(this.minIndex, this.maxIndex)
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
      this.filteredData = this.sales.filter((sale: { client_name: string; employee_lastname: string; employee_name: string; installation: string;}) => {
        return (
          (this.estadoValue === '0') &&
          (rgxSearch.test(sale.client_name) || rgxSearch.test(sale.employee_lastname) || rgxSearch.test(sale.employee_name) )
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
      this.filteredData = this.sales;
      this.currentPage = this.pointers[0];
      this.minIndex = this.pointers[1];
      this.maxIndex = this.pointers[2];
      this.totalPages = this.pointers[3];
      this.data = this.sales.slice(this.minIndex, this.maxIndex);
      this.pointers = [];
    }
  }
}
