import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss','../home/home.component.scss']
})
export class VentasComponent {
  //pagination
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  //data
  products:any[] = []
  clients:any = []
  sales: any = []
  data:any = []
  cart:any = []
  states:any = []
  paymentStates:string[]= ['UN SOLO PAGO','A PLAZOS']

  //filters
  searchQuery: string = ''
  estadoValue = '0'
  //sale
  clienteSelected = ''
  productSelected = ''
  paymentSelected = ''

  //register a sale
  selectedProducts: { name: string, quantity: number,cod:string }[] = [];
  @Input() instalation: string = ''
  @Input() user_id: string = ''
  showSaleForm: boolean = false;

  //real time handlers
  salesAllEventSubscription: any
  paymentsAllEventSubscription: any

  constructor(private service: Kera3Service) {}

  async ngOnInit() {
    await this.fetchSales();
    this.products = await this.service.getProducts(this.instalation);
    // Define an array of names to filter
    const validStateNames = ['CANCELADO', 'PENDIENTE DE PAGO', 'FINALIZADO'];
    // Filter the states array to include only the valid names
    this.states = this.states.filter((state: { nombre_estado: string; }) => validStateNames.includes(state.nombre_estado));
    this.clients = await this.service.getClients();
    this.states = await this.service.getAllStates();
    this.subscribeToChanges();
  }
  changePanelMode(){
    this.showSaleForm = !this.showSaleForm
  }
  //details from the sale
  getDetails(saleData:any){
    let productList = '';
    saleData.products.forEach((product: { id: any; name: any; price: any; quantity:any; }) => {
      productList += `${product.name}, Cantidad: ${product.quantity}, Precio Unitario: ${product.price} \n`;
      });
      Swal.fire({
        title: `Detalles venta a ${saleData.client_name}`,
        html: `
        <p>Productos:</p>
        <pre>${productList}</pre>
        `,
        confirmButtonText: 'OK'
      });
  }

  // Method to add a product to selectedProducts array
  addProduct() {
    const quantityInput = document.getElementById('quantityInput') as HTMLInputElement;
    // Find the selected product based on codigo_producto
    const selectedProduct = this.products.find(product => product.codigo_producto === this.productSelected);
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
  confirmSale() {
    // Check if clienteSelected is empty
    if (!this.clienteSelected) {
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
  }
  //send the sale to database
  sendSaleData() {
    // Perform actions to send the sale data
    // You can send the data to your server or perform other operations here
    this.service.addVenta(this.user_id,this.instalation, this.clienteSelected , this.paymentSelected, this.selectedProducts);
    // Reset form
    this.paymentSelected = '';
    this.clienteSelected = '';
    this.showSaleForm = false;
    this.selectedProducts = [];
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
    this.currentPage = 1
    this.maxIndex = this.itemsPerPage;
    this.minIndex = 0;
    this.data = this.sales.slice(this.minIndex,this.maxIndex)
  }
  returnLastPage() {
    this.currentPage = this.totalPages
    this.maxIndex = this.sales.length;
    this.minIndex = this.sales.length-this.itemsPerPage;
    this.data = this.sales.slice(this.minIndex,this.maxIndex)
  }
  nextPage() {
    if (this.currentPage !== this.totalPages){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.sales.slice(this.minIndex, this.maxIndex)
    }
  }
  prevPage() {
    if (this.currentPage !== 1) {
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.sales.slice(this.minIndex, this.maxIndex)
    }
  }
  get totalPages(): number {
    return Math.ceil(this.sales.length / this.itemsPerPage);
  }
  //filters
  onSearch() {
    if (this.searchQuery !== "") {
      let rgx_search = new RegExp(this.searchQuery.toLocaleUpperCase(), 'i')
      for (let index = 0; index < this.sales.length; index++) {
        if (rgx_search.test( this.sales[index]['nombres'].toLocaleUpperCase() ) || rgx_search.test( this.sales[index]['apellidos'].toLocaleUpperCase())){
          this.data = [...this.data, this.sales[index]]
        }
      }
    } else {
      this.data = this.sales.slice(this.minIndex, this.maxIndex)
    }
  }
  subscribeToChanges(){
    this.paymentsAllEventSubscription = this.service.getSupabase().channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registro_inventario' },
        (payload) => {
          this.fetchSales();
        }
      )
      .subscribe();

      this.salesAllEventSubscription = this.service.getSupabase().channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movimiento_producto' },
        (payload) => {
          this.fetchSales();
        }
      )
      .subscribe();
  }
  //fetchers and real time
  async fetchSales() : Promise<void>{
    this.sales = await this.service.getAllSales();
    this.sales?.map(async (sale: { [x: string]: any; sale_code: string; total_amount: string; }) =>{
      let payments = await this.service.getPaymentsDetails(sale.sale_code);
      if(payments != null){
        let payment_amount = 0;
        payments.forEach(payment =>{
          payment_amount += payment['monto_movimiento'] ;
        })
        sale['payments'] = payments;
        sale['debt'] = (Number.parseFloat(sale.total_amount) - payment_amount).toString();
      }else{
        sale['payments'] = [];
        sale['debt'] = 0;
      }

    }
    )
    this.data = this.sales.slice(this.minIndex, this.maxIndex)
  }
}
