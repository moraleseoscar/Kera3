/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InstalacionesComponent } from './instalaciones.component';

describe('InstalacionesComponent', () => {
  let component: InstalacionesComponent;
  let fixture: ComponentFixture<InstalacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstalacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstalacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
