import { Component, Input, OnInit } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2';
import { PostgrestError } from '@supabase/supabase-js';
import { async } from 'rxjs';

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


  filterClients: any = []
  dataCli: any = []
  estadoValue = '0'
  types: any = []

  payments: any = []
  filteredData: any =[]
  data:any = []

  searchQuery=""

  panel = "sum"

  @Input() instalation: string = ''
  @Input() clients: any = []
  @Input() sales: any = []
  client_SALES : any = []

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
    this.payments = await this.service.getAbonos();
    this.data = this.payments.slice(this.minIndex,this.maxIndex)
    this.filterClientData()

    this.dataCli = this.clients.slice(this.minIndex,this.maxIndex)
    this.filterClients = this.clients
    this.filteredData = this.payments
    this.types = await this.service.getClientsTypes()
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
  async setPayment(client_code:string,client_name: string,client_debt:number){
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
      if (Number(cant) > client_debt){
        Swal.showValidationMessage('El abono excede la deuda total del cliente')
      }
    return {number: num,amount: cant}
  }})
  if (Recipt){
    this.sendPaymen(client_code, Recipt)
  }
}
  async sendPaymen(client_code:string,Recipt:{number:string,amount:string}) {
    //pagar el más viejo
    await this.fetchSalesDebt(client_code)
    let remainingPayment = Number(Recipt.amount);
    for (var i = 0; i < this.client_SALES.length; i++) {
        if (remainingPayment <= 0) {
            // No remaining payment, break out of loop
            break;
        }
        const saleDebt = Number(this.client_SALES[i]['debt']);
        const paymentAmount = Math.min(remainingPayment, saleDebt);

        try {
            // Attempt to register the payment
            console.log(paymentAmount);
            var res = await this.service.addPayment(this.client_SALES[i].sale_code, String(paymentAmount));
            if ('message' in res && 'details' in res) {
              Swal.fire('Error registrando pagos',`${res.message}`,'error');
            }
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
    }else{
      var res = await this.service.addAbono(client_code, Recipt.number, Recipt.amount)
      if ('message' in res && 'details' in res) {
        Swal.fire('Error registrando abono',`${res.message}`,'error');
      } else{
        Swal.fire('Fianlizado','Recibo realizado','success');
      }
    }
  }
  //for payments
  onSearch(){

  }
  async filterClientData(){ //solo obtener los que tienen deudas para poderle abona
    this.clients = this.clients?.filter((client: { [x: string]: number; }) =>{
      return client['saldo_total'] > 0
    }
    )
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
  async fetchSalesDebt(client_code:string){
    this.client_SALES = this.sales.filter((sale: { client_id: string; }) =>{return sale.client_id == client_code} )

    this.client_SALES = this.client_SALES.filter((sale: { debt: string; }) =>  {return Number(sale.debt) != 0}) //solo las que tienen deuda del cliente
    this.client_SALES = this.client_SALES.sort((a: { sale_date: string | number | Date; }, b: { sale_date: string | number | Date; }) => {
      // Convert the 'sale_date' strings to Date objects for comparison
      const dateA = new Date(a.sale_date);
      const dateB = new Date(b.sale_date);
      // Compare the dates
      return dateA.getTime() - dateB.getTime();
    });
  }
}
