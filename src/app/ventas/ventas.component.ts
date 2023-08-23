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
  sales: any = []
  data:any = []
  searchQuery: string = ''
  estadoValue = '0'
  @Input() instalation: string = ''
  constructor(private service: Kera3Service) {}

  ngOnInit() {

  }
  async onAddSales() {
    let _clients = await this.service.getClients();
    let _products = await this.service.getProducts(this.instalation);
    const { value: selectedClient } = await Swal.fire({
      title: 'Select a client',
      input: 'select',
      inputOptions: _clients?.reduce((options, client) => {
        options[client['codigo_cliente']] = `${client['nombres']} ${client['apellidos']}`;
        return options;
      }, {}),
      inputPlaceholder: 'Select a client'
    });

    if (!selectedClient) {
      return; // User canceled selection
    }

    const { value: selectedProducts } = await Swal.fire({
      title: 'Select products',
      input: 'select',
      inputOptions: _products?.reduce((options: { [x: string]: any; }, product: { [x: string]: any; }) => {
        options[product['codigo_producto']] = product['nombre_producto'];
        return options;
      }, {}),
      inputPlaceholder: 'Select products'
    });

    if (!selectedProducts) {
      return; // User canceled selection
    }

    // Now you have selectedClient (client ID) and selectedProducts (array of product IDs)
    // You can proceed to handle the sale registration
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
