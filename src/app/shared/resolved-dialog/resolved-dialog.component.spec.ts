import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolvedDialogComponent } from './resolved-dialog.component';

describe('ResolvedDialogComponent', () => {
  let component: ResolvedDialogComponent;
  let fixture: ComponentFixture<ResolvedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolvedDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResolvedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
