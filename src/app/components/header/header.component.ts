import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
      <nav class="container mx-auto px-4 py-3">
        <div class="flex justify-between">
          <div class="flex flex-start gap-10 items-center">
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ 'nav.home' | translate }}
            </h1>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ 'nav.about' | translate }}
            </h1>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ 'nav.projects' | translate }}
            </h1>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ 'nav.contact' | translate }}
            </h1>
          </div>
          </div>
          <div class="flex items-center gap-10">
            <select 
              [value]="currentLang"
              (change)="switchLanguage($event)"
              class="px-6 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
              <option value="pt">PT</option>
              <option value="en">EN</option>
            </select>
            <button 
              class="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              (click)="toggleTheme()">
              {{ theme() === 'light' ? '🌙' : '☀️' }}
            </button>
          </div>
        </div>
      </nav>
    </header>
  `,
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class HeaderComponent implements OnInit {
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  themeService = inject(ThemeService);
  theme = this.themeService.getCurrentTheme();

  currentLang = this.translate.currentLang || 'pt';

  ngOnInit() {
    // Set up initial language
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');

    // Subscribe to language changes
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        this.currentLang = event.lang;
        document.documentElement.lang = event.lang;
      });
  }

  switchLanguage(event: Event) {
    const newLang = (event.target as HTMLSelectElement).value;
    this.translate.use(newLang);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}