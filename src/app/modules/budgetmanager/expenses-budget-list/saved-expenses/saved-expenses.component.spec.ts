import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedExpensesComponent } from './saved-expenses.component';

describe('SavedExpensesComponent', () => {
  let component: SavedExpensesComponent;
  let fixture: ComponentFixture<SavedExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
