import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.resetTestingModule();
  });

  afterAll(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('restores the stored theme over the system preference', () => {
    localStorage.setItem('theme', 'dark');

    const service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
  });

  it('falls back to the system preference when nothing is stored', () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe(prefersDark ? 'dark' : 'light');
  });

  it('persists the choice and toggles the document class', () => {
    const service = TestBed.inject(ThemeService);

    service.setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();

    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
  });
});
