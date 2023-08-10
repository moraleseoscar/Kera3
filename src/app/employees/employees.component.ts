import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Kera3Service } from '../services/services.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss','../home/home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesComponent {
  minIndex:number = 0
  maxIndex:number = 5
  currentPage: number = 1
  itemsPerPage: number = 5
  clients: any = []
  data:any = []
  searchQuery: string = ''
  estadoValue = '0'
  rols : any = []
  dpts : any = []

  constructor(private service: Kera3Service) { }

  async ngOnInit() {
    this.clients = await this.service.getEmployees()
    this.data = this.clients.slice(this.minIndex, this.maxIndex)
    this.rols = await this.service.getRoles()
    this.dpts = await this.service.getDepartments()
    console.log(this.dpts)
  }

  returnFirstPage() {
    this.currentPage = 1
    this.maxIndex = this.itemsPerPage;
    this.minIndex = 0;
    this.data = this.clients.slice(this.minIndex,this.maxIndex)
  }
  returnLastPage() {
    this.currentPage = this.totalPages
    this.maxIndex = this.clients.length;
    this.minIndex = this.clients.length-this.itemsPerPage;
    this.data = this.clients.slice(this.minIndex,this.maxIndex)
  }
  nextPage() {
    if (this.currentPage !== this.totalPages){
      this.currentPage +=1
      this.maxIndex+=this.itemsPerPage
      this.minIndex+=this.itemsPerPage
      this.data = this.clients.slice(this.minIndex, this.maxIndex)
    }
  }
  prevPage() {
    if (this.currentPage !== 1) {
      this.currentPage -=1
      this.maxIndex-=this.itemsPerPage
      this.minIndex-=this.itemsPerPage
      this.data = this.clients.slice(this.minIndex, this.maxIndex)
    }
  }
  get totalPages(): number {
    return Math.ceil(this.clients.length / this.itemsPerPage);
  }
  onSearch() {
    if (this.searchQuery !== "") {
      let rgx_search = new RegExp(this.searchQuery.toLocaleUpperCase(), 'i')
      this.data = []
      for (let index = 0; index < this.clients.length; index++) {
        if (rgx_search.test( this.clients[index]['nombres'].toLocaleUpperCase() ) || rgx_search.test( this.clients[index]['apellidos'].toLocaleUpperCase())){
          this.data = [...this.data, this.clients[index]]
        }
      }
    } else {
      this.data = this.clients.slice(this.minIndex, this.maxIndex)
    }
  }
  onAddEmployee(){
    var rol = `<option value="" disabled selected>Rol</option>`
    var dpt = `<option value="" disabled selected>Departamento</option>`
    for (let index = 0; index < this.rols.length; index++) {
      rol += `<option value="${this.rols[index].codigo_rol}">${this.rols[index].nombre_rol}</option>`
    }
    for (let index = 0; index < this.dpts.length; index++) {
      dpt += `<option value="${this.dpts[index].codigo_dptm}">${this.dpts[index].nombre_dptm}</option>`
    }
    Swal.fire({
      title: 'Registrar nuevo empleado',
      html: `
      <input type="text" id="cui" class="swal2-input" placeholder="CUI">
      <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
      <input type="text" id="apellido" class="swal2-input" placeholder="Apellido">
      <select class="uk-select" id="categoria" placeholder="Categoria">
      ${rol}
      </select>
      <select class="uk-select" id="dpt" placeholder="Categoria">
      ${dpt}
      </select>
      <input type="text" id="telefono" class="swal2-input" placeholder="Telefono">
      <input type="email" id="correo" class="swal2-input" placeholder="Correo">
      <input type="password" id="pwrd1" class="swal2-input" placeholder="Contraseña">
      <input type="password" id="pwrd2" class="swal2-input" placeholder="Confirma Contraseña">
      `,
      confirmButtonText: 'Agregar',
      focusConfirm: false,
      preConfirm: () => {

        const cui = (<HTMLInputElement>document.getElementById('cui')).value;
        console.log(cui);
        const nombre = (<HTMLInputElement>document.getElementById('nombre')).value;
        const apellido = (<HTMLInputElement>document.getElementById('apellido')).value;
        const categoria = (<HTMLInputElement>document.getElementById('categoria')).value;
        const dpt = (<HTMLInputElement>document.getElementById('dpt')).value;
        const telefono = (<HTMLInputElement>document.getElementById('telefono')).value;
        const correo = (<HTMLInputElement>document.getElementById('correo')).value;
        const pwrd1 = (<HTMLInputElement>document.getElementById('pwrd1')).value;
        const pwrd2 = (<HTMLInputElement>document.getElementById('pwrd2')).value;

        // Validaciones aquí
        if (!cui || !nombre || !apellido || !categoria || !dpt || !telefono || !correo || !pwrd1 || !pwrd2) {
          Swal.showValidationMessage('Por favor complete todos los campos');
          return;
        }

        if (cui.length !== 13 || !/^\d+$/.test(cui)) {
          Swal.showValidationMessage('El CUI debe tener 13 dígitos y ser numérico');
          return;
        }

        if (pwrd1 !== pwrd2) {
          Swal.showValidationMessage('Las contraseñas no coinciden');
          return;
        }

        return {
          cui: cui,
          nombre: nombre,
          apellido: apellido,
          categoria: categoria,
          dpt: dpt,
          telefono: telefono,
          correo: correo,
          pwrd1: pwrd1,
          pwrd2: pwrd2,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const empleadoData = result.value;
        // Aquí puedes realizar acciones con los datos del empleado ingresados
        console.log(empleadoData);
        this.service.addNewEmployee(empleadoData)
        this.clients = await this.service.getEmployees()
        this.data = this.clients.slice(this.minIndex, this.maxIndex)
      }
      this.service.updateEmployee(result.value)
    });


  }
}
