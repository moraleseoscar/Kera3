import { Component, OnInit } from '@angular/core';

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
  payments: any = []
  filteredData: any =[]
  data:any = []

  searchQuery=""

  constructor() { }
  get totalPages(): number {
    try {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }catch(error){
      return 0
    }
  }
  async ngOnInit() {
  }
  registerPayment() {

  }
  sendPaymen(client_name:string,payment_amount:string){

  }
  onSearch(){

  }
  returnFirstPage() {
    this.currentPage = 1
    this.maxIndex = this.itemsPerPage;
    this.minIndex = 0;
    this.data = this.filteredData.slice(this.minIndex, this.maxIndex)
  }
  returnLastPage() {
    this.currentPage = this.totalPages
    this.maxIndex = this.payments.length;
    this.minIndex = this.payments.length-this.itemsPerPage;
    this.data = this.filteredData.slice(this.minIndex, this.maxIndex)
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
}
