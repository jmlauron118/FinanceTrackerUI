import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsTransactionTypeComponent } from './savings-transaction-type.component';

describe('SavingsTransactionTypeComponent', () => {
  let component: SavingsTransactionTypeComponent;
  let fixture: ComponentFixture<SavingsTransactionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsTransactionTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsTransactionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
