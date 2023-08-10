import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Kera3Service } from '../services/services.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
describe('Kera3Service', () => {
  let service: Kera3Service;
  let supabaseTest= createClient(
    'https://mocyzargxwwmjcppskkc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY3l6YXJneHd3bWpjcHBza2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMyMjU0MzcsImV4cCI6MTk5ODgwMTQzN30._7r2cvTzNNcWVBkGoCf_OjOjK85QwG1UJSf_FUT_p2E'
  )
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Kera3Service]
    });
    service = TestBed.inject(Kera3Service);
  });
  it('should return user data for valid email', async () => {
    const mockEmail = 'car21108@uvg.edu.gt';
    const mockUserData = { user_nombres: 'Bryan', user_apellidos: 'Carillo',codigo_instalacion: 'CC2' , rol_interno:'ADMINISTRADOR',email: mockEmail };
    const result = await service.getUserData(mockEmail);
    expect(result).toEqual(mockUserData);
  });
  it('should return null for invalid email', async () => {
    const mockEmail = 'test@example.com';
    const result = await service.getUserData(mockEmail);
    expect(result).toBeNull();
  })
  // Agrega más pruebas relacionadas con el acceso denegado en diferentes escenarios si es necesario
});
