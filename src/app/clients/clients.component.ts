import { Component, Input, OnInit } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css','../home/home.component.scss']
})
export class ClientsComponent implements OnInit {

  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5

  filteredData: any =[]
  data:any = []
  searchQuery: string = ''
  types: any = []
  estadoValue = '0'
  saldoClientes: any = [];
  constructor(private service: Kera3Service) { }

  @Input() clients: any = []
  //realtime handlers
  registroPagos: any
  salesAllEventSubscription: any
  async ngOnInit() {
    this.fetchData()
    this.subscribeToRealtimeEvents()
  }
  async fetchData(){
    this.data = this.clients.slice(this.minIndex, this.maxIndex)
    this.filteredData = this.clients;
    this.types = await this.service.getClientsTypes()
  }
  applyFilter() {
      const rgxSearch = new RegExp(this.searchQuery, 'i');
      if (this.searchQuery !== "") {
      this.filteredData = this.clients.filter((client: { tipo: string; nombres: string; apellidos: string; }) => {
      return (
        (this.estadoValue === '0' || this.estadoValue === client.tipo) &&
        (rgxSearch.test(client.nombres) || rgxSearch.test(client.apellidos))
      );
    });
    this.data = this.filteredData.slice(this.minIndex, this.maxIndex);
    this.currentPage = 1
    } else{
      this.filteredData = this.clients.filter((client: { tipo: string; }) => {
        return this.estadoValue === '0' || this.estadoValue === client.tipo;
      });
      this.data = this.filteredData.slice(this.minIndex, this.maxIndex);
      this.currentPage = 1
    }
  }


  displayDetails(clientData : any){
    if (clientData.deudas.length > 0) {
      // Client has debts, create a scrollable list
      let debtList = '';
      clientData.deudas.forEach((deuda: { codigo_movimiento: any; fecha_emision: any; saldo_cliente: any; }) => {
        debtList += `Codigo Movimiento: ${deuda.codigo_movimiento}, Fecha Emision: ${deuda.fecha_emision}, Saldo Total: ${deuda.saldo_cliente}\n`;
      });

      Swal.fire({
        title: `${clientData.nombres} ${clientData.apellidos}`,
        html: `
        <p>Direccion:
        ${clientData.direccion}</p>
        <p>Telefono:
          ${clientData.telefono}</p>
        <p>Deudas:</p>
        <pre>${debtList}</pre>
        `,
        confirmButtonText: 'OK'
      });
    } else {
      // Client doesn't have debts, display without the debt list
      Swal.fire({
        title: `${clientData.nombres} ${clientData.apellidos}`,
        html: `
          <p>Direccion:
          ${clientData.direccion}</p>
          <p>Telefono:
          ${clientData.telefono}</p>
          <p> No tiene deudas <p>
        `,
        confirmButtonText: 'OK'
      });
    }
  }
  returnFirstPage() {
    this.currentPage = 1
    this.maxIndex = this.itemsPerPage;
    this.minIndex = 0;
    this.data = this.filteredData.slice(this.minIndex,this.maxIndex)
  }
  returnLastPage() {
    this.currentPage = this.totalPages
    this.maxIndex = this.clients.length;
    this.minIndex = this.clients.length-this.itemsPerPage;
    this.data = this.filteredData.slice(this.minIndex,this.maxIndex)
  }
  nextPage() {
    if (this.currentPage !== this.totalPages){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.filteredData.slice(this.minIndex, this.maxIndex)
    }
  }
  prevPage() {
    if (this.currentPage !== 1) {
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.filteredData.slice(this.minIndex, this.maxIndex)
    }
  }
  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }
  subscribeToRealtimeEvents(){
    this.registroPagos = this.service.getSupabase().channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'registro_pagos' },
      (payload) => {
        this.fetchData();
      }
    )
    .subscribe()
    this.salesAllEventSubscription = this.service.getSupabase().channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registro_inventario' },
        (payload) => {
          this.fetchData();
        }
      )
      .subscribe();
  }
}
