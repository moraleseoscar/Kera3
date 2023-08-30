import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss','../home/home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VentasComponent {
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  products:any[] = []
  productsNames:any = []
  clients:any = []
  sales: any = []
  data:any = []
  cart:any = []
  searchQuery: string = ''
  estadoValue = '0'
  clienteSelected = ''
  productSelected = ''
  selectedProducts: { name: string, quantity: number }[] = [];
  @Input() instalation: string = ''
  showSaleForm: boolean = false;
  constructor(private service: Kera3Service) {}

  async ngOnInit() {
    this.products = await this.service.getProducts(this.instalation);
    this.productsNames = await this.service.getProductNames();
    this.clients = await this.service.getClients();
  }
  changePanelMode(){
    this.showSaleForm = !this.showSaleForm
  }


   // Method to add a product to selectedProducts array
   addProduct() {
    const quantityInput = document.getElementById('quantityInput') as HTMLInputElement;
    const val = parseInt(quantityInput.value, 10);
    console.log(this.productSelected+val);
    if (this.productSelected!='' && val > 0) {
      this.selectedProducts.push({ name: this.productSelected, quantity: parseInt(quantityInput.value,10) });
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
  // Method to confirm sale
  confirmSale() {
    // Perform actions to save the sale
    // Reset form
    this.showSaleForm = false;
    this.selectedProducts = [];
  }

  // Method to cancel sale
  cancelSale() {
    // Reset form
    this.showSaleForm = false;
    this.selectedProducts = [];
  }

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
  onSearch() {
    if (this.searchQuery !== "") {
      let rgx_search = new RegExp(this.searchQuery.toLocaleUpperCase(), 'i')
      this.data = []
      for (let index = 0; index < this.sales.length; index++) {
        if (rgx_search.test( this.sales[index]['nombres'].toLocaleUpperCase() ) || rgx_search.test( this.sales[index]['apellidos'].toLocaleUpperCase())){
          this.data = [...this.data, this.sales[index]]
        }
      }
    } else {
      this.data = this.sales.slice(this.minIndex, this.maxIndex)
    }
  }

}