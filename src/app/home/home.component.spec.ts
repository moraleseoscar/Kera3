// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HomeComponent } from './home.component';
// import { Kera3Service } from '../services/services.service';

// describe('HomeComponent', () => {
//   let component: HomeComponent;
//   let fixture: ComponentFixture<HomeComponent>;
//   let mockKera3Service: jasmine.SpyObj<Kera3Service>;

//   // Datos simulados para el componente HomeComponent
//   const mockProducts = [
//     {
//       codigo_producto: 1,
//       nombre_producto: 'Producto 1',
//       nombre_categoria: 'Categoría 1',
//       codigo_dimensional: 'D-123',
//       cantidad: 10,
//       nombre_estado: 'Activo',
//       codigo_instalacion: 'I-001',
//     },
//     // ... Agrega más datos simulados para products según tus necesidades
//   ];

//   const mockCategorias = [
//     { codigo_categoria: 'cat-1', nombre_categoria: 'Categoría 1' },
//     // ... Agrega más datos simulados para categorias según tus necesidades
//   ];

//   const mockEstados = [
//     { codigo_estado: '1', nombre_estado: 'Activo' },
//     // ... Agrega más datos simulados para estados según tus necesidades
//   ];

//   const mockDimens = [
//     { codigo_dimensional: 'D-123', nombre_dimensional: 'Dimensión 1' },
//     // ... Agrega más datos simulados para dimens según tus necesidades
//   ];

//   const mockInstalaciones = [
//     { codigo_instalacion: 'I-001', nombre_instalacion: 'Sucursal 1' },
//     // ... Agrega más datos simulados para instalaciones según tus necesidades
//   ];

//   const mockUserData = {
//     user_nombres: 'John',
//     user_apellidos: 'Doe',
//     codigo_instalacion: 'I-001',
//     rol_interno: 'USER ROL',
//     email: 'john.doe@example.com',
//   };

//   beforeEach(() => {
//     // Crea un objeto spy (simulado) del servicio Kera3Service
//     mockKera3Service = jasmine.createSpyObj<Kera3Service>('Kera3Service', [
//       'getAllProducts',
//       'getAllCategories',
//       'getAllStates',
//       'getAllDimens',
//       'getInstalaciones',
//       'getUserData',
//       'addProduct',
//       'addProductCategory',
//       'addInventoryRegister',
//       'logOut',
//     ]);

//     TestBed.configureTestingModule({
//       declarations: [HomeComponent],
//       providers: [
//         { provide: Kera3Service, useValue: mockKera3Service },
//         // También puedes proporcionar otros servicios necesarios para el componente
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(HomeComponent);
//     component = fixture.componentInstance;

//     // Configura los métodos del servicio Kera3Service simulados para devolver los datos simulados
//     mockKera3Service.getAllProducts.and.returnValue(Promise.resolve(mockProducts));
//     mockKera3Service.getAllCategories.and.returnValue(Promise.resolve(mockCategorias));
//     mockKera3Service.getAllStates.and.returnValue(Promise.resolve(mockEstados));
//     mockKera3Service.getAllDimens.and.returnValue(Promise.resolve(mockDimens));
//     mockKera3Service.getInstalaciones.and.returnValue(Promise.resolve(mockInstalaciones));
//     mockKera3Service.getUserData.and.returnValue(Promise.resolve(mockUserData));
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   // Otras pruebas para métodos y funcionalidades específicas del componente
// });
