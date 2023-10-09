import { Component, OnInit } from '@angular/core';
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
    this.clients = await this.service.getClients();
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
    const {value} = await Swal.fire({
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
    return {Recipt_number: num}
  }})
}
  sendPaymen(client_name:string,payment_amount:string){

  }
  //for payments
  onSearch(){

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

}
