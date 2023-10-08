import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(private service: Kera3Service , private route: ActivatedRoute, private router: Router , private changeDetectorRef: ChangeDetectorRef){

   }
  async ngOnInit(){
    let email = await sessionStorage.getItem('datos');
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


  }



  setCurrentNav(panel :string){
    this.navcurrent = panel
  }
  logOut(){
    this.service.logOut();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
