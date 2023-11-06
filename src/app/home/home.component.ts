import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'
import { Kera3Service } from '../services/services.service';
import { ActivatedRoute , Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  navcurrent: string = 'inv' //variable de navegacion

  clients : any = []
  products : any = []
  sales : any = []
  userData : {user_id:string,user_nombres : string ;
                user_apellidos: string;
                codigo_instalacion: string;
                rol_interno: string;
                email: string}
              = {user_id:'0000',user_nombres :'username' , user_apellidos : 'last names',
              codigo_instalacion: '',
              rol_interno: 'USER ROL',
              email: 'mail'} //variable de info del usuario en sesion solo para lo visual en UI


  //realtime handlers
  //inventario
  invUpdateSubscription:any;
  invInsertSubscription:any;
  //ventas
  salesAllEventSubscription: any
  paymentsAllEventSubscription: any
  //clientes:
  clientInsertsOnClientsTbled: any
  clientInsertsOnPaymentsTbled: any
  clientInsertsOnRecordsTbled: any
  constructor(private service: Kera3Service , private route: ActivatedRoute, private router: Router ){

   }
  async ngOnInit(){
    let email = sessionStorage.getItem('datos');
    let user = await this.service.getUserData(email);
      try{
        if(user !=null){
          this.userData= {user_id:user[0]['user_uid'],user_nombres :user[0]['user_nombres'] , user_apellidos : user[0]['user_apellidos'],
          codigo_instalacion: user[0]['codigo_instalacion'],
          rol_interno: user[0]['rol_interno'],
          email: user[0]['email']}
        }
      }catch (error){
      }
    this.fetchAll()
    this.subscrbeAll()

  }
  setCurrentNav(panel :string){
    this.navcurrent = panel
  }
  logOut(){
    this.service.logOut();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  //metodos para los datos compartidos de varios páneles
  //llamar a todos los fetc
  async fetchAll(){
    await this.fetchInventory()
    await this.fetchSales()
    await this.fetchClientsData()

  }
  //clientes , ventas y abonos: Datos de clientes
  async fetchClientsData(){
    let _clients = await this.service.getClients() //temporal hold of clients
    let _saldos =  await this.service.getSaldoClientes();
    _clients?.map(client => {
      //verificar si tiene pendientes de pago
      const deudas = _saldos?.filter(item => item['codigo_cliente'] == client['codigo_cliente'])
      const saldo_total = deudas?.reduce((sum, item) => sum + item['saldo_cliente'], 0.00);
      client['saldo_total'] = saldo_total;
      client['deudas'] = deudas
    });
    this.clients = _clients
  }
  //inventario filtrado
  async fetchInventory() {
    try {
      this.products = await this.service.getAllProducts()
      this.products = this.products.filter((product: { codigo_instalacion: string; }) =>{
        return product.codigo_instalacion == this.userData.codigo_instalacion
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async fetchSales(){
    this.sales = await this.service.getAllSales();
    let updatedSales: any[] = [];
    await Promise.all(this.sales.map(async (sale: { [x: string]: any; sale_code: string; total_amount: string; }) => {
        let payments = await this.service.getPaymentsDetails(sale.sale_code);
        if (payments != null) {
            let payment_amount = 0;
            payments.forEach(payment => {
                payment_amount += payment['monto_movimiento'];
            });
            sale['payments'] = payments;
            sale['debt'] = (Number.parseFloat(sale.total_amount) - payment_amount).toString();
        } else {
            sale['payments'] = [];
            sale['debt'] = 0;
        }
        if (sale['codigo_estado'] == '10') {
            let nDate = new Date(sale['fecha_vencimiento']);
            let restDate = new Date();
            let result = Math.floor((nDate.getTime() - restDate.getTime()) * 1 / 1000 * 1 / 3600 * 1 / 24);
            sale['credit_days'] = result;
        } else {
            sale['credit_days'] = 'NA';
        }
        updatedSales.push(sale); // Push the modified sale object to the updatedSales array
        //sort the sales
        updatedSales = updatedSales.sort((a, b) => {
          const dateA = new Date(a.sale_date).getTime();
          const dateB = new Date(b.sale_date).getTime();
          return dateB - dateA; // Sort in descending order (most recent first)
        });
        //give the new format to the sale_date
        updatedSales = updatedSales.map((sale) => {
          sale.sale_date = String(sale.sale_date).replace('T',' ');
        });
    }));

    this.sales = updatedSales;
  }
  //real time handlings
  subscrbeAll(){ //subscribirse a todos los datos tiempo real que lo requieren
    this.subscribeToInvChanges()
    this.subscribeToSaleChanges()
    this.subscribeToClientsChanges()
  }
  //inventario
  subscribeToInvChanges() {
    this.invInsertSubscription = this.service.getSupabase().channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'registro_inventario' },
        async (payload) => {
          await this.fetchInventory() // llamar los datos de nuevo
        }
      )
      .subscribe();

    this.invUpdateSubscription = this.service.getSupabase().channel('custom-update-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'registro_inventario' },
      (payload) => {
        this.products?.forEach((element: { codigo_registro: any; cantidad: any; }) => {
          if(element.codigo_registro == payload.new['codigo_registro']) {
            element.cantidad = payload.new['cantidad'];
      }});
      }
    )
    .subscribe()
  }
  unsubscribeToInvChanges() {
    if (this.invInsertSubscription) {
      this.invInsertSubscription.unsubscribe();
    }
    if (this.invUpdateSubscription) {
      this.invUpdateSubscription.unsubscribe();
    }
  }
  //ventas
  subscribeToSaleChanges(){
    this.paymentsAllEventSubscription = this.service.getSupabase().channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registro_inventario' },
        async (payload) => {
          await this.fetchSales();
        }
      )
      .subscribe();

      this.salesAllEventSubscription = this.service.getSupabase().channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movimiento_producto' },
        async (payload) => {
          await this.fetchSales();
        }
      )
      .subscribe();
  }
  //clientes
  subscribeToClientsChanges(){
    this.clientInsertsOnClientsTbled = this.service.getSupabase().channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cliente' },
        async (payload) => {
          await this.fetchClientsData();
        }
      )
      .subscribe();
    this.clientInsertsOnPaymentsTbled = this.service.getSupabase().channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'registro_pagos' },
      async (payload) => {
        await this.fetchClientsData();
      }
    )
    .subscribe();
    this.clientInsertsOnRecordsTbled = this.service.getSupabase().channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'registro_recibos' },
      async (payload) => {
        await this.fetchClientsData();
      }
    )
    .subscribe();
}
}
