import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const PLAYER_TABLE = 'player'
export const TEAM_TABLE = 'club'
export const COUNTRY_TABLE = 'country'
export const ALL = '*'


@Injectable({
  providedIn: 'root'
})
export class Kera3Service {
  private supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(
        'https://mocyzargxwwmjcppskkc.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY3l6YXJneHd3bWpjcHBza2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMyMjU0MzcsImV4cCI6MTk5ODgwMTQzN30._7r2cvTzNNcWVBkGoCf_OjOjK85QwG1UJSf_FUT_p2E'
    )
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
   async getAllProducts(){
    let { data: inventario, error } = await this.supabase.rpc('get_registro_inventario')
    return inventario
  }
  async addProduct(values: any){
    console.log(values)
    const { data, error } = await this.supabase.from('producto').insert([  { codigo_producto: values.codigo, nombre_producto: values.nombre, descripcion_producto: values.descripcion, codigo_dimensional: values.unidad, precio_producto: values.precio },])
  }
  async addInstallation(values: any){
    console.log(values)
    const { data, error } = await this.supabase.from('instalacion').insert([  { codigo_instalacion: values.codigo, nombre_instalacion: values.nombre, descripcion_instalacion: values.descripcion, codigo_tipo_instalacion: values.tipo, direccion: values.direccion },])
  }
  async addProductCategory(values:any){
    const { data, error } = await this.supabase.from('producto_categoria').insert([  { codigo_producto: values.codigo, codigo_categoria: values.categoria },])
  }
  async addInventoryRegister(values:any){
    const { data, error } = await this.supabase.from('registro_inventario').insert([  { codigo_instalacion: values.cod_instalacion, codigo_producto: values.codigo, cantidad: values.cantidad, codigo_proveedor: 'PP001', codigo_estado: '7' },])
    console.log(data)
    console.log(error)
  }
  async getClients(){
    let { data: cliente, error } = await this.supabase.from('cliente').select("*")
    return cliente || null
  }
  async getClientsTypes(){
    let { data: cliente, error } = await this.supabase.rpc('get_cliente_tipos')
    return cliente || null
  }
  async getInstalaciones(){
    let { data: cliente, error } = await this.supabase.rpc('get_registro_instalaciones')
    return cliente || null
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
  async getUserData(email:string){
    let {data: user, error } = await this.supabase.rpc('get_user_extra_data', {mail:email})
    return user || null
  }
}
