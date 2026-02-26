import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnFromInvestmentDialogComponent } from './return-from-investment-dialog.component';

describe('ReturnFromInvestmentDialogComponent', () => {
  let component: ReturnFromInvestmentDialogComponent;
  let fixture: ComponentFixture<ReturnFromInvestmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnFromInvestmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnFromInvestmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
