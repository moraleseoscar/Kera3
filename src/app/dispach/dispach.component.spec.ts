import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispachComponent } from './dispach.component';

describe('DispachComponent', () => {
  let component: DispachComponent;
  let fixture: ComponentFixture<DispachComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DispachComponent]
    });
    fixture = TestBed.createComponent(DispachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
