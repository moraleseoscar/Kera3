import { Component, OnInit } from '@angular/core';
import { Kera3Service } from '../services/services.service';

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
    console.log(this.instalaciones)
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
}
