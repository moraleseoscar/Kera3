import { Component, OnInit } from '@angular/core';
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
  clients: any = []
  data:any = {}
  searchQuery: string = ''
  types: any = []
  estadoValue = '0'
  constructor(private service: Kera3Service) { }

  async ngOnInit() {
    this.clients = await this.service.getClients()
    this.data = this.clients.slice(this.minIndex, this.maxIndex)
    this.types = await this.service.getClientsTypes()
    console.log(this.types)
  }

  returnFirstPage() {
    this.currentPage = 1
    this.maxIndex = this.itemsPerPage;
    this.minIndex = 0;
    this.data = this.clients.slice(this.minIndex,this.maxIndex)
  }
  returnLastPage() {
    this.currentPage = this.totalPages
    this.maxIndex = this.clients.length;
    this.minIndex = this.clients.length-this.itemsPerPage;
    this.data = this.clients.slice(this.minIndex,this.maxIndex)
  }
  nextPage() {
    if (this.currentPage !== this.totalPages){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.clients.slice(this.minIndex, this.maxIndex)
    }
  }
  prevPage() {
    if (this.currentPage !== 1) {
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.clients.slice(this.minIndex, this.maxIndex)
    }
  }
  get totalPages(): number {
    return Math.ceil(this.clients.length / this.itemsPerPage);
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
}
