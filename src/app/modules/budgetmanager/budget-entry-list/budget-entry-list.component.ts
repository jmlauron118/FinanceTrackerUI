import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetEntryResponseDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-response-dto';
import { PaginationMetadata } from '@interfaces/pagination-metadata';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { BudgetmanagerService } from '@services/budgetmanager/budgetmanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { BudgetEntryComponent } from './budget-entry/budget-entry.component';

@Component({
  selector: 'app-budget-entry-list',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, BudgetEntryComponent],
  templateUrl: './budget-entry-list.component.html',
  styleUrls: ['./budget-entry-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BudgetEntryListComponent {
  entries: BudgetEntryResponseDto[] = [];
  meta: PaginationMetadata | null = null;
  title = 'Budget Entry List';

  pageNumber = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50];
  pageNumbers: number[] = [];

  activeDropdown: number | null = null;

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();
  showEntryForm = false;

  constructor (
    private budgetManagerService: BudgetmanagerService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.showEntryForm = false;
    this.loadPage(1);

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadPage(1);
    });
  }

  loadPage(page: number) {
    this.pageNumber = page < 0 ? 1 : page;
    const search = (this.searchControl.value || '').trim();

    this.budgetManagerService.getBudgetEntries(this.pageNumber, this.pageSize, search)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => {
          this.entries = result.items.data;
          this.meta = result.meta;
          this.createPageNumbers();
        },
        error: err => (this.snackbar.danger(err, 5000))
      });
  }

  changePageSize(size: number) {
    this.pageSize = size,
    this.loadPage(1);
  }

  goToPrevious() {
    if(this.meta && this.meta.hasPrevious) {
      this.loadPage(this.pageNumber - 1);
    }
  }

  goToNext() {
    if(this.meta && this.meta.hasNext) {
      this.loadPage(this.pageNumber + 1);
    }
  }

  private createPageNumbers() {
    const totalPages = this.meta?.totalPages ?? 0;
    this.pageNumbers = [];
    
    if(totalPages <= 1) return;
    
    if(totalPages <= 10) {
      for(let i = 1; i <= totalPages; i++) this.pageNumbers.push(i);
    }
    else{
      const window = 7;
      let start = Math.max(1, this.pageNumber - Math.floor(window/2));
      let end = start + window - 1;

      if(end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - window + 1);
      }

      for(let i = start; i <= end; i++) this.pageNumbers.push(i);
    }
  }

  toggleDropdown(index: number): void {
    this.activeDropdown = this.activeDropdown === index ? null : index;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNewEntry() {
    this.showEntryForm = true;
  }

  onBack() {
    this.showEntryForm = false;
  }
}
