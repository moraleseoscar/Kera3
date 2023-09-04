import { Component, OnInit } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-instalaciones',
  templateUrl: './instalaciones.component.html',
  styleUrls: ['./instalaciones.component.css','../home/home.component.scss']
})
export class InstalacionesComponent implements OnInit {
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  instalaciones: any = []
  data:any = []
  searchQuery: string = ''
  types: any = []
  estadoValue = '0'
  constructor(private service: Kera3Service) { }

  async ngOnInit() {
    this.instalaciones = await this.service.getInstalaciones()
    this.data = this.instalaciones.slice(this.minIndex, this.maxIndex)
    this.types = await this.service.getInstalacionesTipos()
  }

  returnFirstPage() {
    this.currentPage = 1
    this.maxIndex = this.itemsPerPage;
    this.minIndex = 0;
    this.data = this.instalaciones.slice(this.minIndex,this.maxIndex)
  }
  returnLastPage() {
    this.currentPage = this.totalPages
    this.maxIndex = this.instalaciones.length;
    this.minIndex = this.instalaciones.length-this.itemsPerPage;
    this.data = this.instalaciones.slice(this.minIndex,this.maxIndex)
  }
  nextPage() {
    if (this.currentPage !== this.totalPages){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.instalaciones.slice(this.minIndex, this.maxIndex)
    }
  }
  prevPage() {
    if (this.currentPage !== 1) {
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.instalaciones.slice(this.minIndex, this.maxIndex)
    }
  }
  get totalPages(): number {
    return Math.ceil(this.instalaciones.length / this.itemsPerPage);
  }
  onSearch() {
    if (this.searchQuery !== "") {
      let rgx_search = new RegExp(this.searchQuery.toLocaleUpperCase(), 'i')
      this.data = []
      for (let index = 0; index < this.instalaciones.length; index++) {
        if (rgx_search.test( this.instalaciones[index]['nombre_instalacion'] )||rgx_search.test( this.instalaciones[index]['codigo_instalacion'])){
          this.data = [...this.data, this.instalaciones[index]]
        }
      }
    } else {
      this.data = this.instalaciones.slice(this.minIndex, this.maxIndex)
    }
  }

  async insertingInstallation () {
    var tipo = `<option value="" disabled selected>Tipo de Instalación</option>`
    for (let index = 0; index < this.types.length; index++) {
      tipo = tipo+`<option value="${this.types[index].codigo_tipo_instalacion}">${this.types[index].nombre_tipo_instalacion}</option>`
    }

    Swal.fire({
      title: 'Agregar instalación',
      html: `
        <input type="text" id="codigo" class="swal2-input" placeholder="Código">
        <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
        <input type="text" id="descripcion" class="swal2-input" placeholder="Descripción">
        <input type="text" id="direccion" class="swal2-input" placeholder="Dirección">
        <select class="uk-select" id="tipo" placeholder="Tipo de Instalación">
          ${tipo}
        </select>
      `,
      confirmButtonText: 'Ingrese nueva instalación',
      focusConfirm: false,
      preConfirm: () => {
        const codigo = (<HTMLInputElement>document.getElementById('codigo')).value;
        const nombre = (<HTMLInputElement>document.getElementById('nombre')).value;
        const descripcion = (<HTMLSelectElement>document.getElementById('descripcion')).value;
        const direccion = (<HTMLSelectElement>document.getElementById('direccion')).value;
        const indexTipo = (<HTMLSelectElement>document.getElementById('tipo')).value;
        return {
          codigo: codigo,
          nombre: nombre,
          descripcion: descripcion,
          direccion: direccion,
          tipo: indexTipo
        };
      }
    }).then( async (result) => {
      if (result.isConfirmed) {
        this.service.addInstallation(result.value)
        this.instalaciones = await this.service.getInstalaciones()
      }
    });
  }
}
