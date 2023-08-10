import { Component, Input, OnInit } from '@angular/core';
import { Kera3Service } from '../services/services.service';
@Component({
  selector: 'app-dispach',
  templateUrl: './dispach.component.html',
  styleUrls: ['./dispach.component.scss','../home/home.component.scss']
})
export class DispachComponent {
  estados: any = []
  constructor(private service: Kera3Service){}
  ngOnInit(): void {
    this.estados = this.service.getAllStates()
  }

}
