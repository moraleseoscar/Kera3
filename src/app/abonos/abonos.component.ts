import { Component, Input, OnInit } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abonos',
  templateUrl: './abonos.component.html',
  styleUrls: ['./abonos.component.css','../home/home.component.scss']
})
export class AbonosComponent implements OnInit {
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5

  clients: any = []
  filterClients: any = []
  dataCli: any = []
  estadoValue = '0'
  types: any = []

  payments: any = []
  filteredData: any =[]
  data:any = []

  saldos :any = []

  searchQuery=""

  panel = "sum"

  @Input() instalation: string = ''
  constructor(private service: Kera3Service) { }
  get totalPages(): number {
    try {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }catch(error){
      return 0
    }
  }
  get totalPagesCli(){
    try {
      return Math.ceil(this.filterClients.length / this.itemsPerPage);
      }catch(error){
        return 0
      }
  }
  async ngOnInit() {
    this.payments = await this.service.getPayments();
    this.data = this.payments.slice(this.minIndex,this.maxIndex)
    this.clients = await this.fetchCliData();
    this.dataCli = this.clients.slice(this.minIndex,this.maxIndex)
    this.filterClients = this.clients
    this.filteredData = this.payments
    this.types = await this.service.getClientsTypes()
    this.saldos = await this.service.getSaldoClientes();
  }
  SwitchPanel() {
    this.minIndex = 0
    this.maxIndex = 5
    this.currentPage = 1
    switch (this.panel){
      case "sum":{
        this.panel = "cli"
        break;
      }
      case "cli":{
        this.panel = "sum"
        break;
      }
    }
  }
  async setPayment(client_code:string,client_name: string){
    const {value:Recipt} = await Swal.fire({
      title: `Registrar un recibo para ${client_name}`,
      html:
    '<input id="num" class="swal2-input" placeholder="Número Recibo">' +
    '<input id="cant" class="swal2-input" placeholder="Cantidad en Q">',
    preConfirm: () => {
      var num = (<HTMLInputElement>document.getElementById('num')).value;
      var cant = (<HTMLInputElement>document.getElementById('cant')).value;
      if (!num || num == ''){
        Swal.showValidationMessage('Numero de recibo faltante')
      }
      if (!cant || cant == '' || Number(cant) < 0){
        Swal.showValidationMessage('Cantidad no valida')
      }
    return {number: num,amount: cant}
  }})
}
  async sendPaymen(client_code:string,payment_amount:number){
    let sales = await this.fetchSalesDebt(client_code);
    //pagar el más viejo
    let remainingPayment = payment_amount;
    if (Array.isArray(sales)){
    for (const sale of sales) {
        if (remainingPayment <= 0) {
            // No remaining payment, break out of loop
            break;
        }

        const saleDebt = parseFloat(sale.debt);
        const paymentAmount = Math.min(remainingPayment, saleDebt);

        try {
            // Attempt to register the payment
            await this.service.addPayment(sale.sale_code, String(paymentAmount));
            remainingPayment -= paymentAmount;
        } catch (error) {
            // Handle Postgres error here, you can log it or handle it as needed
            console.error("Error registering payment:", error);
            // Break out of the loop or handle the error as per your requirement
            break;
        }
    }

    if (remainingPayment > 0) {
        // Handle case where there is remaining payment that could not be applied
        console.log("Remaining payment could not be applied:", remainingPayment);
        // You might want to handle this situation, such as displaying a message to the user
    }
  }
  }
  //for payments
  onSearch(){

  }
  async fetchCliData(){ //solo obtener los que tienen deudas para poderle abonar
    let _clients = await this.service.getClients() //temporal hold of clients
    let _saldos =  await this.service.getSaldoClientes();
    _clients?.map(client => {
      //verificar si tiene pendientes de pago
      const deudas = _saldos?.filter(item => item['codigo_cliente'] == client['codigo_cliente'])
      const saldo_total = deudas?.reduce((sum, item) => sum + item['saldo_cliente'], 0.00);
      client['saldo_total'] = saldo_total;
      client['deudas'] = deudas
    });
    let _clients_ = _clients?.filter((client) =>{
      return client['saldo_total'] > 0
    }
    )
    return _clients_
    }
  //for clients
  applyFilter() {
    const rgxSearch = new RegExp(this.searchQuery, 'i');
    if (this.searchQuery !== "") {
    this.filterClients = this.clients.filter((client: { tipo: string; nombres: string; apellidos: string; }) => {
    return (
      (this.estadoValue === '0' || this.estadoValue === client.tipo) &&
      (rgxSearch.test(client.nombres) || rgxSearch.test(client.apellidos))
    );
  });
  this.dataCli = this.filterClients.slice(this.minIndex, this.maxIndex);
  this.currentPage = 1
  } else{
    this.filterClients = this.clients.filter((client: { tipo: string; }) => {
      return this.estadoValue === '0' || this.estadoValue === client.tipo;
    });

    this.dataCli = this.filterClients.slice(this.minIndex, this.maxIndex);
    this.currentPage = 1
  }
}
  returnFirstPage() {
    switch (this.panel) {
      case 'sum' :{
        this.currentPage = 1
        this.maxIndex = this.itemsPerPage;
        this.minIndex = 0;
        this.data = this.filteredData.slice(this.minIndex, this.maxIndex)
        break;
      }
      case 'cli':{
        this.currentPage = 1
        this.maxIndex = this.itemsPerPage;
        this.minIndex = 0;
        this.dataCli = this.filterClients.slice(this.minIndex, this.maxIndex)
        break;
      }
    }

  }
  returnLastPage() {
    switch (this.panel) {
      case 'sum' :{
        this.currentPage = this.totalPages
        this.maxIndex = this.payments.length;
        this.minIndex = this.payments.length-this.itemsPerPage;
        this.data = this.filteredData.slice(this.minIndex, this.maxIndex)
        break;
      }
      case 'cli':{
        this.currentPage = this.totalPagesCli
        this.maxIndex = this.clients.length;
        this.minIndex = this.clients.length-this.itemsPerPage;
        this.dataCli = this.filterClients.slice(this.minIndex, this.maxIndex)
        break;
      }
    }
  }
  nextPage() {
    switch (this.panel) {
      case 'sum' :{
        if (this.currentPage !== this.totalPages){
          this.currentPage +=1
          this.maxIndex+=this.itemsPerPage
          this.minIndex+=this.itemsPerPage
          this.data = this.filteredData.slice(this.minIndex, this.maxIndex)
        }
        break;
      }
      case 'cli':{
        if (this.currentPage !== this.totalPagesCli){
          this.currentPage +=1
          this.maxIndex+=this.itemsPerPage
          this.minIndex+=this.itemsPerPage
          this.dataCli = this.filterClients.slice(this.minIndex, this.maxIndex)
        }
        break;
      }
    }
  }
  prevPage() {
    switch (this.panel) {
      case 'sum' :{
        if (this.currentPage !== 1) {
          this.currentPage -=1
          this.maxIndex-=this.itemsPerPage
          this.minIndex-=this.itemsPerPage
          this.data = this.filteredData.slice(this.minIndex, this.maxIndex)
        }
        break;
      }
      case 'cli':{
        if (this.currentPage !== 1) {
          this.currentPage -=1
          this.maxIndex-=this.itemsPerPage
          this.minIndex-=this.itemsPerPage
          this.dataCli = this.filterClients.slice(this.minIndex, this.maxIndex)
        }
        break;
      }
    }
  }
  async fetchSalesDebt(client_code:string) : Promise<void>{
    let sales = await this.service.getAllSales();
    sales?.map(async (sale: { [x: string]: any; sale_code: string; total_amount: string; }) =>{
      if (sale['installation_code'] == this.instalation && sale['client_id'] == client_code){
        let payments = await this.service.getPaymentsDetails(sale.sale_code);
        if(payments != null) {
          let payment_amount = 0;
          payments.forEach(payment =>{
            payment_amount += payment['monto_movimiento'] ;
          })
          sale['payments'] = payments;
          sale['debt'] = (Number.parseFloat(sale.total_amount) - payment_amount).toString();
        }
        else {
          sale['payments'] = [];
          sale['debt'] = 0;
        }
      }
      }
    )
    sales = sales?.filter((sale: { [x: string]: number; }) =>  {return sale['debt'] >0}) //solo las que tienen deuda del cliente

    sales = sales?.sort((a: { sale_date: string | number | Date; }, b: { sale_date: string | number | Date; }) => {
      // Convert the 'sale_date' strings to Date objects for comparison
      const dateA = new Date(a.sale_date);
      const dateB = new Date(b.sale_date);
      // Compare the dates
      return dateA.getTime() - dateB.getTime();
    });
  }
}
