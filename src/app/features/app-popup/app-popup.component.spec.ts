import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPopupComponent } from './app-popup.component';

describe('AppPopupComponent', () => {
  let component: AppPopupComponent;
  let fixture: ComponentFixture<AppPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
