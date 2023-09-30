/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NgModule } from '@angular/core';

import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      // imports: [ NgModule ,FormsModule ],
    })
    .compileComponents());

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Login', () => {
    expect(component).toBeTruthy();
  });
});
