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
   async getAllProducts(){
    let { data: data, error } = await this.supabase.from('globalinventory_view').select('*')
    return data
    }
   
}
