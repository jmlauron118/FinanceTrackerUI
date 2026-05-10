import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private getStoredTheme(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }

    return 'light';
  }

  private themeSubject = new BehaviorSubject<string>(
    this.getStoredTheme()
  );

  theme$ = this.themeSubject.asObservable();

  setTheme(theme: 'light' | 'dark') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }

    this.themeSubject.next(theme);
  }

  toggleTheme() {
    const newTheme =
      this.themeSubject.value === 'dark'
        ? 'light'
        : 'dark';

    this.setTheme(newTheme);
  }

  get currentTheme() {
    return this.themeSubject.value;
  }
}