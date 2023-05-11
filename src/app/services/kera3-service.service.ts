import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Kera3ServiceService {

  url = 'https://mocyzargxwwmjcppskkc.supabase.co/rest/v1/';
  apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY3l6YXJneHd3bWpjcHBza2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMyMjU0MzcsImV4cCI6MTk5ODgwMTQzN30._7r2cvTzNNcWVBkGoCf_OjOjK85QwG1UJSf_FUT_p2E';
  authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY3l6YXJneHd3bWpjcHBza2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMyMjU0MzcsImV4cCI6MTk5ODgwMTQzN30._7r2cvTzNNcWVBkGoCf_OjOjK85QwG1UJSf_FUT_p2E';

  constructor(private http: HttpClient) { }

  getCategorias() {
    const body = {}; // cuerpo vacío si no se especifica
    const headers = { 
      'content-type': 'application/json',
      'apikey': this.apiKey,
      'Authorization': this.authorization
    };
    const options = { headers: headers };
    return this.http.get(this.url + 'categoria?select=*', options);
  }
  

  getEstados() {
    const body = {}; // cuerpo vacío si no se especifica
    const headers = { 
      'content-type': 'application/json',
      'apikey': this.apiKey,
      'Authorization': this.authorization
    };
    const options = { headers: headers };
    return this.http.get(this.url + 'estado?select=*', options);
  }

}
