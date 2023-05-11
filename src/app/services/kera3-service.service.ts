import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Kera3ServiceService {

  url = 'https://mocyzargxwwmjcppskkc.supabase.co/rest/v1/';

  constructor(private http: HttpClient) { }

  getCategorias(params: any){
    const headers = { 'content-type': 'application/json'};
    const body=JSON.stringify(params);
    console.log(body);

    return this.http.post(this.url + 'categoria?select=*', body,{headers});
  }

  getEstados(params: any){
    const headers = { 'content-type': 'application/json'};
    const body=JSON.stringify(params);
    console.log(body);

    return this.http.post(this.url + 'estado?select=*', body,{headers});
  }

}
