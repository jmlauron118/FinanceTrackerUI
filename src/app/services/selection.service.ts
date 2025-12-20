import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionService<T extends { id: number }> {
  private selectedIds = new Set<number>();
  private allItems: T[] = [];

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
  }

  /**
   * Checks if an item is selected.
   * @param id The ID of the item to check.
   */
  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
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
   * Returns the selected items as an array.
   */
  getSelectedItems(): T[] {
    return this.allItems.filter(item => this.selectedIds.has(item.id));
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
