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
  displayDetails(clientData : any){
    console.log(clientData)
    if (clientData.deudas.length > 0) {
      // Client has debts, create a scrollable list
      let debtList = '';
      clientData.deudas.forEach((deuda: { codigo_movimiento: any; fecha_emision: any; saldo_cliente: any; }) => {
        if(Number(deuda.saldo_cliente) > 0){
        debtList += `<tr>
        <td> ${deuda.codigo_movimiento} </td>,
        <td>${deuda.fecha_emision.replace('T',' ')}</td>,
        <td>${deuda.saldo_cliente}</td>
        </tr>`;
        }
      });

      Swal.fire({
        title: `${clientData.nombres} ${clientData.apellidos}`,
        html: `
        <p>Direccion:
        ${clientData.direccion}</p>
        <p>Telefono:
        ${clientData.telefono}</p>
        <p>Deudas:</p>

        <table class="uk-table uk-table-small uk-table-striped uk-table-responsive">
            <thead>
                <tr>
                    <th class="uk-table-small">Codigo</th>
                    <th class="uk-table-small">Fecha</th>
                    <th class="uk-table-small">Deuda</th>
                </tr>
            </thead>
            <tbody>
            ${debtList}
            </tbody>
            </table>
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
  onSearch() {
    if (this.searchQuery !== "") {
      let rgx_search = new RegExp(this.searchQuery.toLocaleUpperCase(), 'i')
      this.data = []
      for (let index = 0; index < this.clients.length; index++) {
        if (rgx_search.test( this.clients[index]['nombres'].toLocaleUpperCase() ) || rgx_search.test( this.clients[index]['apellidos'].toLocaleUpperCase())){
          this.data = [...this.data, this.clients[index]]
        }
      }
    } else {
      this.data = this.clients.slice(this.minIndex, this.maxIndex)
    }
  }
  onAddClient(){
    Swal.fire({
      title: 'Registrar nuevo cliente',
      html: `
      <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
      <input type="text" id="apellido" class="swal2-input" placeholder="Apellido">
      <select id="tipo" class="uk-select" placeholder="Tipo">
      <option value="">Tipo</option>
      <option value="Persona">Persona</option>
      <option value="Empresa">Empresa</option>
      </select>
      <input type="text" id="telefono" class="swal2-input" placeholder="Telefono">
      <input type="text" id="direccion" class="swal2-input" placeholder="Direccion">
      `,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar', // Texto del botón Cancelar
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (<HTMLInputElement>document.getElementById('nombre')).value;
        const apellido = (<HTMLInputElement>document.getElementById('apellido')).value;
        const categoria = (<HTMLInputElement>document.getElementById('tipo')).value;
        const telefono = (<HTMLInputElement>document.getElementById('telefono')).value;
        const correo = (<HTMLInputElement>document.getElementById('direccion')).value;

        // Validaciones aquí
        if (!nombre || !apellido || !categoria || !telefono || !correo) {
          Swal.showValidationMessage('Por favor complete todos los campos');
          return;
        }
        return {
          nombre: nombre,
          apellido: apellido,
          tipo: categoria,
          telefono: telefono,
          direccion: correo,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const empleadoData = result.value;
        // Aquí puedes realizar acciones con los datos del empleado ingresados
        this.service.insertClient(empleadoData);
      }
      this.clients = await this.service.getEmployees()
      this.data = this.clients.slice(this.minIndex, this.maxIndex)
    });


  }
}
