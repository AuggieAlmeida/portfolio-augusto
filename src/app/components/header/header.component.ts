import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white dark:bg-neutral-900 shadow-lg border-b border-primary-100 dark:border-primary-800 transition-all duration-300">
      <nav class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-8">
            <div class="group cursor-pointer">
              <h2 class="text-xl font-bold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors font-heading">
                <i class="fas fa-home mr-2"></i>
                {{ 'nav.home' | translate }}
              </h2>
            </div>
            <div class="group cursor-pointer">
              <h2 class="text-lg font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors font-heading">
                <i class="fas fa-user mr-2"></i>
                {{ 'nav.about' | translate }}
              </h2>
            </div>
            <div class="group cursor-pointer">
              <h2 class="text-lg font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors font-heading">
                <i class="fas fa-folder mr-2"></i>
                {{ 'nav.projects' | translate }}
              </h2>
            </div>
            <div class="group cursor-pointer">
              <h2 class="text-lg font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors font-heading">
                <i class="fas fa-envelope mr-2"></i>
                {{ 'nav.contact' | translate }}
              </h2>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <select 
                [value]="currentLang"
                (change)="switchLanguage($event)"
                class="pr-8 py-2 rounded-lg bg-primary-50 ring-2 ring-primary-200 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-sans">
                <option value="pt">🇧🇷 PT</option>
                <option value="en">🇺🇸 EN</option>
                <option value="fr">🇫🇷 FR</option>
                <option value="es">🇪🇸 ES</option>
              </select>
            </div>
            <button 
              class="p-2 px-3 rounded-lg bg-primary-100 dark:bg-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700/70 border border-primary-200 dark:border-primary-700 transition-all duration-200 transform hover:scale-105"
              (click)="toggleTheme()">
              <i [class]="theme() === 'light' ? 'fas fa-moon' : 'fas fa-circle-half-stroke'" class="text-lg"></i>
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