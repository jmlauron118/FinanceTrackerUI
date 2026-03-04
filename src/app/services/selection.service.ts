import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionService<T extends { id: number }> {
  private selectedIds = new Set<number>();
  private allItems: T[] = [];
  public indeterminate = false;

  /**
   * Sets the items to manage selection for.
   * @param items The list of items to manage.
   */
  setItems(items: T[]) {
    this.allItems = items;
    this.syncSelectionState();
  }

  /**
   * Returns the total count of items.
   */
  getItemCount(): number {
    return this.allItems.length;
  }

  /**
   * Toggles the selection state of an item.
   * @param id The ID of the item to toggle.
   * @param event The triggering event (e.g., checkbox click).
   */
  toggle(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    checked ? this.selectedIds.add(id) : this.selectedIds.delete(id);
    this.indeterminate = this.isIndeterminate();
  }

  /**
   * Checks if an item is selected.
   * @param id The ID of the item to check.
   */
  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

   /**
   * Selects all items.
   */
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    checked ? this.allItems.forEach(item => this.selectedIds.add(item.id)) : this.selectedIds.clear();
    this.indeterminate = this.isIndeterminate();
  }

  isIndeterminate(): boolean {
    return this.selectedIds.size > 0 && this.selectedIds.size < this.allItems.length;
  }

  /**
   * Clears all selections.
   */
  clear() {
    this.selectedIds.clear();
  }

  /**
   * Returns the selected IDs as an array.
   */
  getSelectedIds(): number[] {
    return Array.from(this.selectedIds);
  }

  /**
   * Returns the count of selected items.
   */
  getSelectedCount(): number {
    return this.selectedIds.size;
  }

  /**
   * Synchronizes the selection state with the current items.
   */
  private syncSelectionState() {
    const validIds = new Set(this.allItems.map(item => item.id));
    this.selectedIds.forEach(id => {
      if (!validIds.has(id)) this.selectedIds.delete(id);
    });
  }
}
