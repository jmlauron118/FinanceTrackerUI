import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentTypeDialogComponent } from './investment-type-dialog.component';

describe('InvestmentTypeDialogComponent', () => {
  let component: InvestmentTypeDialogComponent;
  let fixture: ComponentFixture<InvestmentTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentTypeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
