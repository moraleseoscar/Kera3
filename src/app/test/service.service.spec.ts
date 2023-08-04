import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Kera3Service } from '../services/services.service';
import { createClient } from '@supabase/supabase-js'
describe('Kera3Service', () => {
  let service: Kera3Service;
  let supabaseT = createClient(
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

  it('should call signInWithPassword with correct parameters', async () => {
    const mockUsername = 'test@example.com';
    const mockPassword = 'testpassword';

    spyOn(supabaseT.auth, 'signInWithPassword').and.returnValue(Promise.resolve({}));

    await service.login(mockUsername, mockPassword);

    expect(supabaseT.auth.signInWithPassword).toHaveBeenCalledWith({ email: mockUsername, password: mockPassword });
  });

  it('should return the response from signInWithPassword', async () => {
    const mockResponse = { token: 'mockToken' };
    spyOn(supabaseT.auth, 'signInWithPassword').and.returnValue(Promise.resolve(mockResponse));

    const result = await service.login('test@example.com', 'testpassword');

    expect(result).toEqual(mockResponse);
  });

  it('should not grant access with non-existing user', async () => {
    const nonExistingUser = 'nonexistinguser@example.com';
    const password = 'testpassword';

    try {
      await service.login(nonExistingUser, password);
      fail('El acceso debería haber sido denegado para un usuario inexistente');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  // Agrega más pruebas relacionadas con el acceso denegado en diferentes escenarios si es necesario
});
