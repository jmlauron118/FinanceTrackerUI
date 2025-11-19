import { Injectable } from '@angular/core';
import { BudgetEntryDeleteDto } from '@interfaces/budgetmanager/budget-entry/budget-entry-delete-dto';

@Injectable({
  providedIn: 'root'
})
export class SelectionService<T extends { id: number }> {
  private selectedIds = new Set<number>();
  private allItems: T[] = [];

  setItems(items: T[]) {
    this.allItems = items;
    this.syncSelectionState();
  }

  getItemCount(): number {
    return this.allItems.length;
  }

  toggle(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    checked ? this.selectedIds.add(id) : this.selectedIds.delete(id);
  }

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  clear() {
    this.selectedIds.clear();
  }

  getSelectedIds(): BudgetEntryDeleteDto[] {
    return Array.from(this.selectedIds).map(id => ({ budgetEntryId: id }));
  }

  getSelectedCount(): number {
    return this.selectedIds.size;
  }

  private syncSelectionState() {
    const validIds = new Set(this.allItems.map(item => item.id));
    this.selectedIds.forEach(id => {
      if (!validIds.has(id)) this.selectedIds.delete(id);
    });
  }
}
