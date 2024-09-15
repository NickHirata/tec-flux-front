import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChamadosListComponent } from './chamados-list.component';

describe('ChamadosListComponent', () => {
  let component: ChamadosListComponent;
  let fixture: ComponentFixture<ChamadosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChamadosListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChamadosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
