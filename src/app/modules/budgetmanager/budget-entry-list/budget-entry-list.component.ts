import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetEntryResponseDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-response-dto';
import { PaginationMetadata } from '@interfaces/pagination-metadata';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, take } from 'rxjs';
import { BudgetmanagerService } from '@services/budgetmanager/budgetmanager.service';
import { SnackbarService } from '@services/snackbar.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/shared/material.module';
import { MatDialog } from '@angular/material/dialog';
import { BudgetEntryDialogComponent } from './budget-entry-dialog/budget-entry-dialog.component';
import { ConfirmDialogService } from '@services/confirm-dialog.service';
import { SelectionService } from '@services/selection.service';
import { BudgetEntryDeleteDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-delete-dto';
import { LoadingService } from '@services/loading.service';

@Component({
  selector: 'app-budget-entry-list',
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
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
  private firstLoad$ = new Subject<void>();
  selectionMode = false;
  sorter = true;

  @ViewChild('selectAllCheckbox', {static: false}) selectAllCheckbox!: ElementRef<HTMLInputElement>;
  constructor (
    private budgetManagerService: BudgetmanagerService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private confirm: ConfirmDialogService,
    private loading: LoadingService,
    public selection: SelectionService<{ id: number }>
  ) {}

  ngOnInit(): void {
    this.loadPage(1);
    this.selectionMode = false;

    this.initSelection();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadPage(1);
    });
  }

  initSelection(): void {
    this.firstLoad$
    .pipe(take(1))
    .subscribe(() => {
      this.selection.setItems(this.entries.map(e => ({ id: e.budgetEntryId })));
      this.selectionMode = false;
      this.selection.clear();
    });
  }

  loadPage(page: number) {
    this.loading.show();
    this.pageNumber = page < 0 ? 1 : page;
    const search = (this.searchControl.value || '').trim();

    this.budgetManagerService.getBudgetEntries(this.pageNumber, this.pageSize, search, this.sorter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => {
          this.entries = result.items.data;
          this.meta = result.meta;
          this.createPageNumbers();
          this.firstLoad$.next();
        },
        error: err => {
          this.snackbar.danger(err, 5000);
          this.loading.hide();
        },
        complete: () => this.loading.hide()
      });
  }

  sortedLoadPage() {
    this.searchControl.setValue('');
    this.loadPage(1);
  }

  removeBudgetEntry(id: number): void {
    this.loading.show();
    this.budgetManagerService.removeBudgetEntry(id).subscribe({
      next: response => {
        this.snackbar.success(response.message, 5000);
        this.loadPage(this.meta?.currentPage || 1);
        this.initSelection();
      },
      error: err => {
        this.snackbar.danger(err, 5000);
        this.loading.hide();
      }
    });
  }

  removeBudgetEntryBulk(idList: BudgetEntryDeleteDto[]): void {
    this.loading.show();
    this.budgetManagerService.removeBudgetEntryBulk(idList).subscribe({
      next: response => {
        this.snackbar.success(response.message, 5000);
        this.loadPage(this.getCurrentPageNumber());
        this.initSelection();
      },
      error: err => {
        this.snackbar.danger(err, 5000);
        this.loading.hide();
      }
    });
  }

  changePageSize(size: number) {
    this.pageSize = size,
    this.loadPage(1);
    this.initSelection();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAddNewEntryDialog(): void {
    const dialogRef = this.dialog.open(BudgetEntryDialogComponent, {
      panelClass: 'custom-dialog',
      width: '500px',
      maxWidth: '90vw'
    });

    dialogRef.componentInstance.entrySaved.subscribe(() => {
      this.loadPage(1);
      this.initSelection();
    });
  }

  openEditEntryDialog(budgetEntry: BudgetEntryResponseDto): void {
    const dialogRef = this.dialog.open(BudgetEntryDialogComponent, {
      panelClass: 'custom-dialog',
      width: '500px',
      maxWidth: '90vw',
      data: budgetEntry
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.loadPage(this.meta?.currentPage || 1);
        this.initSelection();
      }
    });
  }

  onRemoveEntry(id: number): void {
    this.confirm.openConfirm({
      title: 'Remove Budget Entry',
      message: 'Are you sure you want to remove this budget entry?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      icon: 'warning'
    }).subscribe(result => {
      if (result) {
        this.removeBudgetEntry(id);
      }
    });
  }

  toggleSelectionMode(){
    this.selectionMode = !this.selectionMode;
    if (!this.selectionMode) this.selection.clear();
  }

  toggleRowSelection(id: number, event: Event) {
    this.selection.toggle(id, event);
  }

  get hasSelection(): boolean {
    return this.selection.getSelectedIds().length > 0;
  }

  onRemoveSelectedEntries() {
    const selectedIds = this.selection.getSelectedIds();

    if (selectedIds.length !== 0) {
      this.confirm.openConfirm({
        title: 'Remove Selected Budget Entries',
        message: `Are you sure you want to remove the selected ${selectedIds.length} budget entr${selectedIds.length > 1 ? 'ies' : 'y'}?`,
        confirmText: 'Remove',
        cancelText: 'Cancel',
        icon: 'warning'
      }).subscribe(result => {
        if (result) {
          const idList: BudgetEntryDeleteDto[] = selectedIds.map(id => ({ budgetEntryId: id }));
          this.removeBudgetEntryBulk(idList);
        }
      });
    }
  }

  getCurrentPageNumber(): number {
    const pageSize = this.meta?.pageSize || 1;
    const selectedCount = this.selection.getSelectedCount();
    const totalCount = this.meta?.totalCount || 0;
    const currentPage = this.meta?.currentPage || 1;
    let remainingCount: number;
    let actualPageNumber: number;

    remainingCount = totalCount - selectedCount;
    actualPageNumber = Math.ceil(remainingCount / pageSize);
    
    return currentPage > actualPageNumber ? actualPageNumber : currentPage;
  }
}
