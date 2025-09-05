import { Component, inject, OnInit, DestroyRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavService } from '../../core/services/nav.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // ← Estratégia OnPush
  template: `
    <header class="bg-white dark:bg-neutral-900 shadow-md border-b border-primary-100 dark:border-primary-800 transition-all duration-300 sticky top-0 z-50">
      <nav class="container mx-auto px-4 py-2 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button aria-label="Logo" class="logo-container" (click)="scrollTo('hero')">
            <img 
              src="assets/images/Logo.png" 
              alt="logo" 
              class="h-12 w-12 object-contain rounded-md cursor-pointer animate-pulse-slow hover:animate-float transition-all duration-300"
              loading="lazy"
            >
          </button>

          <div class="nav-scroll-wrapper max-w-[56vw] overflow-x-auto no-scrollbar">
            <div class="flex items-center gap-3 whitespace-nowrap">
              <div class="nav-item" data-section="hero" (click)="scrollTo('hero')" [class.active]="activeSection === 'hero'">
                <h2 class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors">
                  <i class="fas fa-home text-base animate-pulse-slow"></i>
                  {{ 'nav.home' | translate }}
                </h2>
              </div>

              <div class="nav-item" data-section="about" (click)="scrollTo('about')" [class.active]="activeSection === 'about'">
                <h2 class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors">
                  <i class="fas fa-user"></i>
                  {{ 'nav.about' | translate }}
                </h2>
              </div>

              <div class="nav-item" data-section="skills" (click)="scrollTo('skills')" [class.active]="activeSection === 'skills'">
                <h2 class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors">
                  <i class="fas fa-bolt"></i>
                  {{ 'nav.skills' | translate }}
                </h2>
              </div>

              <div class="nav-item" data-section="projects" (click)="scrollTo('projects')" [class.active]="activeSection === 'projects'">
                <h2 class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors">
                  <i class="fas fa-folder"></i>
                  {{ 'nav.projects' | translate }}
                </h2>
              </div>

              <div class="nav-item" data-section="contact" (click)="scrollTo('contact')" [class.active]="activeSection === 'contact'">
                <h2 class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors">
                  <i class="fas fa-envelope"></i>
                  {{ 'nav.contact' | translate }}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <select [value]="currentLang" (change)="switchLang($event)" class="text-sm px-2 py-2 rounded-lg bg-primary-50 dark:text-neutral-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 focus:ring-2 focus:ring-primary-500 transition-all">
            <option value="pt">🇧🇷 PT</option>
            <option value="en">🇺🇸 EN</option>
            <option value="es">🇪🇸 ES</option>
            <option value="fr">🇫🇷 FR</option>
          </select>

          <button (click)="toggleTheme()" class="p-1.5 px-2 rounded-lg bg-primary-100 dark:text-neutral-100 dark:bg-primary-800/40 border border-primary-200 dark:border-primary-700 transition-all">
            <i [class]="isDark ? 'fas fa-circle-half-stroke' : 'fas fa-moon'"></i>
          </button>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; height: 6px; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .nav-item { padding: .25rem .6rem; border-radius: .375rem; transition: all .18s ease; cursor: pointer; }
    .nav-item:hover { transform: translateY(-2px); }
    .nav-item.active h2 { color: #6366f1; animation: text-glow 2.5s ease-in-out infinite; position: relative; }
    .nav-item.active h2::after { content: ''; position: absolute; left: 0; bottom: -6px; width: 100%; height: 2px; border-radius: 2px; background: linear-gradient(90deg,#6366f1,#a855f7); box-shadow: 0 0 12px rgba(168,85,247,0.18); }

    @keyframes text-glow {
      0%,100% { color: #6366f1; text-shadow: 0 0 6px rgba(99,102,241,0.22); }
      50% { color: #a855f7; text-shadow: 0 0 12px rgba(168,85,247,0.32); }
    }

    @media (max-width: 768px) {
      .nav-scroll-wrapper { max-width: 42vw; }
    }
  `]
})
export class HeaderComponent implements OnInit {
  private translate = inject(TranslateService);
  private nav = inject(NavService);
  private theme = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef); // ← Para ChangeDetectionStrategy.OnPush

  activeSection = 'hero';
  currentLang = this.translate.currentLang || 'pt';
  isDark = this.theme.getCurrentTheme() === 'dark';

  ngOnInit() {
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang);

    this.nav.active$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(s => {
      this.activeSection = s;
      this.cdr.markForCheck(); // ← Notificar Angular para verificar mudanças
    });

    this.theme.theme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(t => {
      this.isDark = t === 'dark';
      this.cdr.markForCheck(); // ← Notificar Angular para verificar mudanças
    });

    // Usando passive events para melhor performance de scroll
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }

  switchLang(e: Event) {
    const v = (e.target as HTMLSelectElement).value;
    this.currentLang = v;
    this.translate.use(v);
    document.documentElement.lang = v;
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }

  scrollTo(id: string) {
    const headerHeight = document.querySelector('header')?.clientHeight || 64;
    this.nav.scrollTo(id, headerHeight - 20);
    this.pulseItem(id);
  }


  private pulseItem(sectionId: string) {
    const el = document.querySelector(`[data-section="${sectionId}"]`);
    if (!el) return;
    el.classList.add('animate-pulse-slow');
    setTimeout(() => el.classList.remove('animate-pulse-slow'), 900);
  }

  private onScroll = () => {
    const sections = ['hero','about','skills','projects','contact'];
    const offset = (document.querySelector('header')?.clientHeight || 64) + 120;
    const scroll = window.pageYOffset + offset;
    for (const s of sections) {
      const el = document.getElementById(s);
      if (!el) continue;
      const top = el.offsetTop;
      const h = el.offsetHeight;
      if (scroll >= top && scroll < top + h) {
        this.nav.setActive(s);
        break;
      }
    }
  }
}
