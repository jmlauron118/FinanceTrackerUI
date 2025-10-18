import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleActionsComponent } from './module-actions.component';

describe('ModuleActionsComponent', () => {
  let component: ModuleActionsComponent;
  let fixture: ComponentFixture<ModuleActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
