import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<'light'|'dark'>(this.initialTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.theme$.subscribe(t => {
      if (t === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    });
  }

  private initialTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // prefer system
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(t: 'light'|'dark') {
    localStorage.setItem('theme', t);
    this.themeSubject.next(t);
  }

  toggleTheme() {
    const current = this.themeSubject.value;
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  getCurrentTheme() {
    return this.themeSubject.value;
  }
}
