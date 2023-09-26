import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { format } from 'date-fns';
export const PLAYER_TABLE = 'player'
export const TEAM_TABLE = 'club'
export const COUNTRY_TABLE = 'country'
export const ALL = '*'


@Injectable({
  providedIn: 'root'
})
export class Kera3Service {

  private supabase: SupabaseClient;
  private tmp_user: any;
  private invSubs: any;
  constructor() {
    this.supabase = createClient(
        'https://mocyzargxwwmjcppskkc.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY3l6YXJneHd3bWpjcHBza2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMyMjU0MzcsImV4cCI6MTk5ODgwMTQzN30._7r2cvTzNNcWVBkGoCf_OjOjK85QwG1UJSf_FUT_p2E'
    )
   }

   getSupabase(){
    return this.supabase
   }
   async getProducts(sucursal: string) {
    let { data, error } = await this.supabase
      .rpc('get_registro_inventario_place', {
        _codplace: sucursal
      })

    return data || null

  }
   async getAllCategories(){let { data: categoria, error } = await this.supabase.from('categoria').select('*')
   return categoria || null
   }
   async getAllStates(){let { data: estado, error } = await this.supabase.from('estado').select('*')
   return estado || null
   }
   async getAllDimens(){
    let { data: dimensional, error } = await this.supabase.from('dimensional').select('*')
    return dimensional
  }
  async getProductNames(){
    let { data: producto, error } = await this.supabase.from('producto').select('nombre_producto')
    return producto
  }
  async getCoso(){
    let { data: coso, error } = await this.supabase.rpc('get_coso')
    return coso
  }
  async getCompras(){
    let { data: compras, error } = await this.supabase.rpc('get_compras')
    return compras
  }
  async getProveedores(){
    let { data: proveedor, error } = await this.supabase.from('proveedor').select('*');
    return proveedor;
  }
   async getAllProducts(){
    let { data: inventario, error } = await this.supabase.rpc('get_registro_inventario')
    return inventario
  }
  async addProduct(values: any){
    const { data, error } = await this.supabase.from('producto').insert([  { codigo_producto: values.codigo, nombre_producto: values.nombre, descripcion_producto: values.descripcion, codigo_dimensional: values.unidad, precio_producto: values.precio },])
  }
  async addInstallation(values: any){
    const { data, error } = await this.supabase.from('instalacion').insert([  { codigo_instalacion: values.codigo, nombre_instalacion: values.nombre, descripcion_instalacion: values.descripcion, codigo_tipo_instalacion: values.tipo, direccion: values.direccion },])
  }
  async addProductCategory(values:any){
    const { data, error } = await this.supabase.from('producto_categoria').insert([  { codigo_producto: values.codigo, codigo_categoria: values.categoria },])
  }
  async addInventoryRegister(values:any){
    const { data, error } = await this.supabase.from('registro_inventario').insert([  { codigo_instalacion: values.cod_instalacion, codigo_producto: values.codigo, cantidad: values.cantidad, codigo_proveedor: 'PP001', codigo_estado: '7' },])
  }
  async getClients(){
    let { data: cliente, error } = await this.supabase.from('cliente').select("*")
    return cliente || null
  }
  async getClientsTypes(){
    let { data: cliente, error } = await this.supabase.rpc('get_cliente_tipos')
    return cliente || null
  }
  async getDespachos(){
    let { data: cliente, error } = await this.supabase.rpc('get_despachos')
    return cliente || null
  }
  async getInstalaciones(){
    let { data: cliente, error } = await this.supabase.rpc('get_registro_instalaciones')
    return cliente || null
  }
  async getAllInstalaciones()
  {
    let { data: instalaciones, error} = await this.supabase.from('instalacion').select('*');
    return instalaciones || null;
  }
  async getInstalacionesTipos(){
  let { data: tipo_instalacion, error } = await this.supabase.from('tipo_instalacion').select('*')
    return tipo_instalacion || null
  }
  async login(username:string, password:string){
     return await this.supabase.auth.signInWithPassword({email: username, password: password})
  }
  async logOut(){
    this.supabase.auth.signOut()
  }
  async getUserData(email:any){
    let {data: user, error } = await this.supabase.rpc('get_user_extra_data', {mail:email})
    return user || null
  }
  async getEmployees(){
      let {data, error } = await this.supabase.from('empleado').select('*')
      return data || error
  }
  async getRoles(){
    let {data, error } = await this.supabase.from('rol').select('*')
    return data || error
  }
  async getDepartments(){
    let {data, error } = await this.supabase.from('departamento').select('*')
    return data || error
  }

  async getSaldoClientes() {
  let { data: saldo_clientes, error } = await this.supabase
  .from('saldo_clientes')
  .select('*')
  return saldo_clientes || null
  }

  async signUp(mail:string, password:string){
    let { data, error } = await this.supabase
    .from('temporal_emp_data_holder')
    .select('email')
    .eq('email', mail)
    if(data?.length != undefined){
      if(data.length > 0){
        let { data:signUp, error:sign_err } = await this.supabase.auth.signUp({
          email: mail,
          password: password,
        })
        if(sign_err){
          return false
        }
        return true
      }
    }
    return false; // no puede hacer sign up, es decir no hay ningun empleado que se espere su ingreso por ser nuevo
  }
  async AddMetadata(user: any){
    const { data, error} = await this.supabase
    .from('temporal_emp_data_holder')
    .insert([
      { cui: user.cui, codigo_rol: user.categoria ,
        codigo_dptm: user.dpt , nombres: user.nombre ,
        apellidos: user.apellido , telefono:user.telefono,
        email: user.correo ,codigo_instalacion:user.instalacion
      }
    ])
    .select()
  }

  async addDispatch(user_id:string,instalacion_emitente: string, instalacion_receptora: string,selectedProducts: { name: string, quantity: number, cod: string }[]) {
    const currentTimestamp = new Date();
    const formattedTimestamp = format(currentTimestamp, 'yyyy-MM-dd HH:mm:ss');
    // Prepare the sale data
    const saleData = {
      codigo_instalacion_emitente: instalacion_emitente,
      codigo_instalacion_receptora: instalacion_receptora,
      codigo_estado: 2,
      codigo_tipo_movimiento: 'D',
      user_id_empleado_encargado: user_id,
      fecha_emision: formattedTimestamp
    };

    // Insert the sale record into the movimiento_producto table
    const { data:values, error } = await this.supabase
      .from('movimiento_producto')
      .upsert([saleData])
      .select();

    if (error) {
      // Handle the error appropriately, e.g., show a message
      console.error('Error adding dispatch:');
      console.error(error);
    } else {
      // Successfully added the sale, now insert the sale details into detalle_movimiento
      const codigo_movimiento = (values as any)?.[0]?.codigo_movimiento;
      if (codigo_movimiento) {
        for (const product of selectedProducts) {
          // Prepare the sale detail data
          const saleDetailData = {
            codigo_movimiento: codigo_movimiento,
            codigo_producto: product.cod,
            cantidad_producto: product.quantity

          };
          // Insert the sale detail record into detalle_movimiento
          const { error: detailError } = await this.supabase.from('detalle_movimiento').upsert([saleDetailData]);
          if (detailError) {
            // Handle the detail error appropriately, e.g., show a message
            console.error('Error adding sale detail:', detailError);
          }
        }
      }
    }
  }
  async addCompra(user_id:string,instalation: string, proveedorSelected: string, paymentSelected: string, selectedProducts: { name: string, quantity: number, monto: number, cod: string }[]) {
    // Determine the codigo_estado based on paymentSelected
    const codigo_estado = paymentSelected === 'UN SOLO PAGO' ? 1 : 10;
    const currentTimestamp = new Date();
    const formattedTimestamp = format(currentTimestamp, 'yyyy-MM-dd HH:mm:ss');
    // Prepare the sale data
    const saleData = {
      codigo_instalacion_emitente: instalation,
      codigo_proveedor: proveedorSelected,
      codigo_estado: codigo_estado,
      codigo_tipo_movimiento: 'C',
      user_id_empleado_encargado: user_id,
      fecha_emision: formattedTimestamp
    };
    // Insert the sale record into the movimiento_producto table
    const { data:values, error } = await this.supabase
      .from('movimiento_producto')
      .upsert([saleData])
      .select();

    if (error) {
      // Handle the error appropriately, e.g., show a message
      console.error('Error adding sale:');
      console.error(error);
    } else {
      // Successfully added the sale, now insert the sale details into detalle_movimiento
      const codigo_movimiento = (values as any)?.[0]?.codigo_movimiento;
      if (codigo_movimiento) {
        for (const product of selectedProducts) {
          // Prepare the sale detail data
          const saleDetailData = {
            codigo_movimiento: codigo_movimiento,
            codigo_producto: product.cod,
            cantidad_producto: product.quantity,
            monto:product.monto
          };

          // Insert the sale detail record into detalle_movimiento
          const { error: detailError } = await this.supabase
            .from('detalle_movimiento')
            .upsert([saleDetailData]);
          if (detailError) {
            // Handle the detail error appropriately, e.g., show a message
            console.error('Error adding sale detail:', detailError);
          }
        }
      }
    }
  }

  async addVenta(user_id:string,instalation: string, clienteSelected: string, paymentSelected: string, selectedProducts: { name: string, quantity: number, cod: string }[]) {
    // Determine the codigo_estado based on paymentSelected
    const codigo_estado = paymentSelected === 'UN SOLO PAGO' ? 1 : 10;
    const currentTimestamp = new Date();
    const formattedTimestamp = format(currentTimestamp, 'yyyy-MM-dd HH:mm:ss');
    // Prepare the sale data
    const saleData = {
      codigo_instalacion_emitente: instalation,
      codigo_cliente: clienteSelected,
      codigo_estado: codigo_estado,
      codigo_tipo_movimiento: 'V',
      user_id_empleado_encargado: user_id,
      fecha_emision: formattedTimestamp
    };

    // Insert the sale record into the movimiento_producto table
    const { data:values, error } = await this.supabase
      .from('movimiento_producto')
      .upsert([saleData])
      .select();

    if (error) {
      // Handle the error appropriately, e.g., show a message
      console.error('Error adding sale:');
      console.error(error);
    } else {
      // Successfully added the sale, now insert the sale details into detalle_movimiento
      const codigo_movimiento = (values as any)?.[0]?.codigo_movimiento;
      if (codigo_movimiento) {
        for (const product of selectedProducts) {
          // Prepare the sale detail data
          const saleDetailData = {
            codigo_movimiento: codigo_movimiento,
            codigo_producto: product.cod,
            cantidad_producto: product.quantity

          };

          // Insert the sale detail record into detalle_movimiento
          const { error: detailError } = await this.supabase
            .from('detalle_movimiento')
            .upsert([saleDetailData]);

          if (detailError) {
            // Handle the detail error appropriately, e.g., show a message
            console.error('Error adding sale detail:', detailError);
          }
        }
      }
    }
  }
  async getAllSales() {
    let {data:sales, error} = await this.supabase.rpc('get_sales')
    return sales || null;
  }
  async getPaymentsDetails(id: string) {
  let { data: registro_pagos, error } = await this.supabase
  .from('registro_pagos')
  .select("*")
  .eq('codigo_movimiento', id)
  return registro_pagos || null;
  }
  async addPayment(codigo:string, monto:string) {
    const saleData =  { codigo_movimiento: codigo ,
     monto_movimiento: monto }
    const { data, error } = await this.supabase
    .from('registro_pagos')
    .insert([
      saleData
    ])
    .select()
    if (error) {
    }
    return data || error
  }
}
