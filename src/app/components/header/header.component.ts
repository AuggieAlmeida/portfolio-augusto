import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

import { PortfolioCommandService } from '../../core/commands/portfolio-command.service';
import { LocaleService } from '../../core/i18n/locale.service';
import { isLocale } from '../../core/i18n/locales';
import { NavService } from '../../core/services/nav.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="bg-white dark:bg-primary-950 shadow-md border-b border-primary-100 dark:border-primary-800 transition-all duration-300 sticky top-0 z-50"
    >
      <nav class="container mx-auto px-4 py-2 flex items-center justify-between">
        <!-- Logo e Menu Hamburguer (Mobile) -->
        <div class="flex items-center justify-between w-full lg:w-auto">
          <!-- Logo -->
          <button
            aria-label="Logo"
            class="logo-container dark:invert"
            (click)="scrollTo('hero')"
            (keyup.enter)="scrollTo('hero')"
            (keyup.space)="scrollTo('hero')"
          >
            <img
              src="assets/images/Logo.png"
              alt="logo"
              class="w-12 object-contain rounded-md cursor-pointer animate-pulse-slow hover:animate-float transition-all duration-300"
              width="48"
              height="48"
              fetchpriority="high"
            />
          </button>

          <!-- Menu Hamburguer (Mobile Only) -->
          <button
            class="lg:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
            (click)="toggleMobileMenu()"
            (keyup.enter)="toggleMobileMenu()"
            (keyup.space)="toggleMobileMenu()"
            aria-label="Abrir menu"
            [attr.aria-expanded]="isMobileMenuOpen ? 'true' : 'false'"
          >
            <i
              aria-hidden="true"
              [class]="isMobileMenuOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl'"
            ></i>
          </button>
        </div>

        <!-- Navegação Desktop -->
        <div class="nav-scroll-wrapper max-w-[56vw] overflow-x-auto no-scrollbar hidden lg:block">
          <div class="flex items-center gap-3 whitespace-nowrap">
            <button
              class="nav-item"
              data-section="hero"
              (click)="scrollTo('hero')"
              (keyup.enter)="scrollTo('hero')"
              (keyup.space)="scrollTo('hero')"
              [class.active]="activeSection === 'hero'"
            >
              <span
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i aria-hidden="true" class="fas fa-home text-base animate-pulse-slow"></i>
                {{ 'nav.home' | translate }}
              </span>
            </button>
            <button
              class="nav-item"
              data-section="about"
              (click)="scrollTo('about')"
              (keyup.enter)="scrollTo('about')"
              (keyup.space)="scrollTo('about')"
              [class.active]="activeSection === 'about'"
            >
              <span
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i aria-hidden="true" class="fas fa-user"></i>
                {{ 'nav.about' | translate }}
              </span>
            </button>
            <button
              class="nav-item"
              data-section="career"
              (click)="scrollTo('career')"
              (keyup.enter)="scrollTo('career')"
              (keyup.space)="scrollTo('career')"
              [class.active]="activeSection === 'career'"
            >
              <span
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i aria-hidden="true" class="fas fa-briefcase"></i>
                {{ 'nav.carrer' | translate }}
              </span>
            </button>
            <button
              class="nav-item"
              data-section="projects"
              (click)="scrollTo('projects')"
              (keyup.enter)="scrollTo('projects')"
              (keyup.space)="scrollTo('projects')"
              [class.active]="activeSection === 'projects'"
            >
              <span
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i aria-hidden="true" class="fas fa-folder"></i>
                {{ 'nav.projects' | translate }}
              </span>
            </button>
            <button
              class="nav-item"
              data-section="skills"
              (click)="scrollTo('skills')"
              (keyup.enter)="scrollTo('skills')"
              (keyup.space)="scrollTo('skills')"
              [class.active]="activeSection === 'skills'"
            >
              <span
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i aria-hidden="true" class="fas fa-bolt"></i>
                {{ 'nav.skills' | translate }}
              </span>
            </button>
          </div>
        </div>

        <!-- Controles Desktop (Idioma e Tema) -->
        <div class="items-center gap-2 hidden lg:flex">
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-2 py-2 text-sm text-neutral-700 transition-all hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-700 dark:bg-primary-900/30 dark:text-neutral-100 dark:hover:bg-primary-800/40"
            aria-label="Abrir quick open"
            (click)="openQuickOpen()"
          >
            <i aria-hidden="true" class="fas fa-magnifying-glass"></i>
            <kbd class="text-xs text-neutral-500 dark:text-neutral-400">⌘K</kbd>
          </button>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-neutral-700 transition-all hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-700 dark:bg-primary-900/30 dark:text-neutral-100 dark:hover:bg-primary-800/40"
            aria-label="Abrir terminal"
            (click)="openTerminal()"
          >
            <i aria-hidden="true" class="fas fa-terminal"></i>
          </button>
          <select
            [value]="currentLang"
            (change)="switchLang($event)"
            [attr.aria-label]="'nav.language' | translate"
            class="text-sm px-2 py-2 rounded-lg bg-primary-50 dark:text-neutral-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="pt">🇧🇷 PT</option>
            <option value="en">🇺🇸 EN</option>
          </select>

          <button
            (click)="toggleTheme()"
            (keyup.enter)="toggleTheme()"
            (keyup.space)="toggleTheme()"
            class="p-1.5 px-2 rounded-lg bg-primary-100 dark:text-neutral-100 dark:bg-primary-800/40 border border-primary-200 dark:border-primary-700 transition-all"
            aria-label="Toggle theme"
          >
            <i
              aria-hidden="true"
              [class]="isDark ? 'fas fa-circle-half-stroke' : 'fas fa-moon'"
            ></i>
          </button>
        </div>

        <!-- Menu Mobile Overlay -->
        <button
          (keyup)="closeMobileMenu()"
          (keydown)="closeMobileMenu()"
          (keypress)="closeMobileMenu()"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden"
          [class]="
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          "
          (click)="closeMobileMenu()"
          aria-label="Fechar menu de overlay"
        ></button>

        <!-- Menu Mobile Content -->
        <div
          class="fixed top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-neutral-900 shadow-xl z-50 transform transition-transform duration-300 lg:hidden"
          [class]="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
        >
          <div class="p-6 h-full flex flex-col">
            <!-- Cabeçalho do Menu Mobile -->
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">Menu</h2>
              <button
                class="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                (click)="closeMobileMenu()"
                (keyup.enter)="closeMobileMenu()"
                (keyup.space)="closeMobileMenu()"
                aria-label="Fechar menu"
              >
                <i aria-hidden="true" class="fas fa-times text-xl"></i>
              </button>
            </div>

            <!-- Navegação Mobile -->
            <nav class="flex-1">
              <ul class="space-y-4">
                <li>
                  <button
                    class="w-full text-left p-3 rounded-lg flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                    (click)="navigateTo('hero')"
                    (keyup.enter)="navigateTo('hero')"
                    (keyup.space)="navigateTo('hero')"
                  >
                    <i aria-hidden="true" class="fas fa-home w-5"></i>
                    {{ 'nav.home' | translate }}
                  </button>
                </li>
                <li>
                  <button
                    class="w-full text-left p-3 rounded-lg flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                    (click)="navigateTo('about')"
                    (keyup.enter)="navigateTo('about')"
                    (keyup.space)="navigateTo('about')"
                  >
                    <i aria-hidden="true" class="fas fa-user w-5"></i>
                    {{ 'nav.about' | translate }}
                  </button>
                </li>
                <li>
                  <button
                    class="w-full text-left p-3 rounded-lg flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                    (click)="navigateTo('career')"
                    (keyup.enter)="navigateTo('career')"
                    (keyup.space)="navigateTo('career')"
                  >
                    <i aria-hidden="true" class="fas fa-briefcase w-5"></i>
                    {{ 'nav.carrer' | translate }}
                  </button>
                </li>
                <li>
                  <button
                    class="w-full text-left p-3 rounded-lg flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                    (click)="navigateTo('projects')"
                    (keyup.enter)="navigateTo('projects')"
                    (keyup.space)="navigateTo('projects')"
                  >
                    <i aria-hidden="true" class="fas fa-folder w-5"></i>
                    {{ 'nav.projects' | translate }}
                  </button>
                </li>
                <li>
                  <button
                    class="w-full text-left p-3 rounded-lg flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                    (click)="navigateTo('skills')"
                    (keyup.enter)="navigateTo('skills')"
                    (keyup.space)="navigateTo('skills')"
                  >
                    <i aria-hidden="true" class="fas fa-bolt w-5"></i>
                    {{ 'nav.skills' | translate }}
                  </button>
                </li>
              </ul>
            </nav>

            <!-- Controles Mobile (Idioma e Tema) -->
            <div class="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <button
                type="button"
                class="w-full p-3 rounded-lg flex items-center justify-between bg-primary-100 dark:text-neutral-100 dark:bg-primary-800/40 border border-primary-200 dark:border-primary-700 transition-all"
                (click)="openTerminal()"
              >
                <span>Terminal</span>
                <i aria-hidden="true" class="fas fa-terminal"></i>
              </button>
              <div>
                <label
                  for="language-select"
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                >
                  {{ 'nav.language' | translate }}
                </label>
                <select
                  id="language-select"
                  [value]="currentLang"
                  (change)="switchLang($event)"
                  class="w-full p-3 rounded-lg bg-primary-50 dark:text-neutral-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 focus:ring-2 focus:ring-primary-500 transition-all"
                >
                  <option value="pt">🇧🇷 Português</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>

              <button
                class="w-full p-3 rounded-lg flex items-center justify-between bg-primary-100 dark:text-neutral-100 dark:bg-primary-800/40 border border-primary-200 dark:border-primary-700 transition-all"
                (click)="toggleTheme()"
                (keyup.enter)="toggleTheme()"
                (keyup.space)="toggleTheme()"
              >
                <span>{{ 'nav.theme' | translate }}</span>
                <i aria-hidden="true" [class]="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [
    `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
        height: 6px;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .nav-item {
        padding: 0.25rem 0.6rem;
        border-radius: 0.375rem;
        transition: all 0.18s ease;
        cursor: pointer;
        background: none;
        border: none;
        outline: none;
      }
      .nav-item:hover {
        transform: translateY(-2px);
      }
      .nav-item.active h2 {
        color: #22c55e; /* primary-500 verde */
        animation: text-glow 2.5s ease-in-out infinite;
        position: relative;
      }
      .nav-item.active h2::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -6px;
        width: 100%;
        height: 2px;
        border-radius: 2px;
        background: linear-gradient(90deg, #22c55e, #16a34a); /* primary-500 to primary-600 */
        box-shadow: 0 0 12px rgba(34, 197, 94, 0.18); /* primary-500 com opacidade */
      }

      @keyframes text-glow {
        0%,
        100% {
          color: #22c55e; /* primary-500 */
          text-shadow: 0 0 6px rgba(34, 197, 94, 0.22);
        }
        50% {
          color: #16a34a; /* primary-600 */
          text-shadow: 0 0 10px rgba(22, 163, 74, 0.32);
        }
      }

      @media (max-width: 1024px) {
        .nav-scroll-wrapper {
          max-width: 42vw;
        }
      }
    `
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private locale = inject(LocaleService);
  private commands = inject(PortfolioCommandService);
  private nav = inject(NavService);
  private theme = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  activeSection = 'hero';
  currentLang = this.locale.current;
  isDark = this.theme.getCurrentTheme() === 'dark';
  isMobileMenuOpen = false;

  ngOnInit() {
    this.locale.locale$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((l) => {
      this.currentLang = l;
      this.cdr.markForCheck();
    });

    this.nav.active$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((s) => {
      this.activeSection = s;
      this.cdr.markForCheck();
    });

    this.theme.theme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((t) => {
      this.isDark = t === 'dark';
      this.cdr.markForCheck();
    });

    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Fecha o menu mobile quando a tela fica grande o suficiente
    if (window.innerWidth >= 1024 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Previne scroll do body quando menu está aberto
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  navigateTo(section: string) {
    this.scrollTo(section);
    this.closeMobileMenu();
  }

  switchLang(e: Event) {
    const value = (e.target as HTMLSelectElement | null)?.value;
    if (isLocale(value)) {
      this.locale.set(value);
    }
  }

  toggleTheme() {
    this.theme.toggleTheme();
    this.cdr.markForCheck();
  }

  openTerminal() {
    this.closeMobileMenu();
    this.commands.openTerminal();
  }

  openQuickOpen() {
    this.commands.openQuickOpen();
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
    const sections = ['hero', 'about', 'career', 'projects', 'skills'];
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
  };
}
