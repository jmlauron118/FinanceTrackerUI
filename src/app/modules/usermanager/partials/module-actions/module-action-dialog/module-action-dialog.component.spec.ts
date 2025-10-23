import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleActionDialogComponent } from './module-action-dialog.component';

describe('ModuleActionDialogComponent', () => {
  let component: ModuleActionDialogComponent;
  let fixture: ComponentFixture<ModuleActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleActionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
