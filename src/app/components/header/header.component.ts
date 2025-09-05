import {
  Component,
  inject,
  OnInit,
  DestroyRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavService } from '../../core/services/nav.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="bg-white dark:bg-neutral-900 shadow-md border-b border-primary-100 dark:border-primary-800 transition-all duration-300 sticky top-0 z-50"
    >
      <nav
        class="container mx-auto px-4 py-2 flex items-center justify-between"
      >
        <!-- Logo e Menu Hamburguer (Mobile) -->
        <div class="flex items-center justify-between w-full lg:w-auto">
          <!-- Logo -->
          <button
            aria-label="Logo"
            class="logo-container"
            (click)="scrollTo('hero')"
            (keyup.enter)="scrollTo('hero')"
            (keyup.space)="scrollTo('hero')"
          >
            <img
              src="assets/images/Logo.png"
              alt="logo"
              class="h-12 w-12 object-contain rounded-md cursor-pointer animate-pulse-slow hover:animate-float transition-all duration-300"
              loading="lazy"
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
              [class]="
                isMobileMenuOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl'
              "
            ></i>
          </button>

        </div>

        <!-- Navegação Desktop -->
        <div
          class="nav-scroll-wrapper max-w-[56vw] overflow-x-auto no-scrollbar hidden lg:block"
        >
          <div class="flex items-center gap-3 whitespace-nowrap">
            <button
              class="nav-item"
              data-section="hero"
              (click)="scrollTo('hero')"
              (keyup.enter)="scrollTo('hero')"
              (keyup.space)="scrollTo('hero')"
              [class.active]="activeSection === 'hero'"
            >
              <h2
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i class="fas fa-home text-base animate-pulse-slow"></i>
                {{ 'nav.home' | translate }}
              </h2>
            </button>
            <button
              class="nav-item"
              data-section="about"
              (click)="scrollTo('about')"
              (keyup.enter)="scrollTo('about')"
              (keyup.space)="scrollTo('about')"
              [class.active]="activeSection === 'about'"
            >
              <h2
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i class="fas fa-user"></i>
                {{ 'nav.about' | translate }}
              </h2>
            </button>
            <button
              class="nav-item"
              data-section="skills"
              (click)="scrollTo('skills')"
              (keyup.enter)="scrollTo('skills')"
              (keyup.space)="scrollTo('skills')"
              [class.active]="activeSection === 'skills'"
            >
              <h2
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i class="fas fa-bolt"></i>
                {{ 'nav.skills' | translate }}
              </h2>
            </button>
            <button
              class="nav-item"
              data-section="projects"
              (click)="scrollTo('projects')"
              (keyup.enter)="scrollTo('projects')"
              (keyup.space)="scrollTo('projects')"
              [class.active]="activeSection === 'projects'"
            >
              <h2
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i class="fas fa-folder"></i>
                {{ 'nav.projects' | translate }}
              </h2>
            </button>
            <button
              class="nav-item"
              data-section="contact"
              (click)="scrollTo('contact')"
              (keyup.enter)="scrollTo('contact')"
              (keyup.space)="scrollTo('contact')"
              [class.active]="activeSection === 'contact'"
            >
              <h2
                class="text-sm md:text-base font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors"
              >
                <i class="fas fa-envelope"></i>
                {{ 'nav.contact' | translate }}
              </h2>
            </button>
          </div>
        </div>

        <!-- Controles Desktop (Idioma e Tema) -->
        <div class="items-center gap-2 hidden lg:flex">
          <select
            [value]="currentLang"
            (change)="switchLang($event)"
            class="text-sm px-2 py-2 rounded-lg bg-primary-50 dark:text-neutral-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="pt">🇧🇷 PT</option>
            <option value="en">🇺🇸 EN</option>
            <option value="es">🇪🇸 ES</option>
            <option value="fr">🇫🇷 FR</option>
          </select>

          <button
            (click)="toggleTheme()"
            (keyup.enter)="toggleTheme()"
            (keyup.space)="toggleTheme()"
            class="p-1.5 px-2 rounded-lg bg-primary-100 dark:text-neutral-100 dark:bg-primary-800/40 border border-primary-200 dark:border-primary-700 transition-all"
            aria-label="Toggle theme"
          >
            <i
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
          [class]="isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
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
              <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Menu
              </h2>
              <button
                class="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                (click)="closeMobileMenu()"
                (keyup.enter)="closeMobileMenu()"
                (keyup.space)="closeMobileMenu()"
                aria-label="Fechar menu"
              >
                <i class="fas fa-times text-xl"></i>
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
                    <i class="fas fa-home w-5"></i>
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
                    <i class="fas fa-user w-5"></i>
                    {{ 'nav.about' | translate }}
                  </button>
                </li>
                <li>
                  <button
                    class="w-full text-left p-3 rounded-lg flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                    (click)="navigateTo('skills')"
                    (keyup.enter)="navigateTo('skills')"
                    (keyup.space)="navigateTo('skills')"
                  >
                    <i class="fas fa-bolt w-5"></i>
                    {{ 'nav.skills' | translate }}
                  </button>
                </li>
                <li>
                  <button
                    class="w-full text-left p-3 rounded-lg flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                    (click)="navigateTo('projects')"
                    (keyup.enter)="navigateTo('projects')"
                    (keyup.space)="navigateTo('projects')"
                  >
                    <i class="fas fa-folder w-5"></i>
                    {{ 'nav.projects' | translate }}
                  </button>
                </li>
                <li>
                  <button
                    class="w-full text-left p-3 rounded-lg flex items-center gap-3 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors"
                    (click)="navigateTo('contact')"
                    (keyup.enter)="navigateTo('contact')"
                    (keyup.space)="navigateTo('contact')"
                  >
                    <i class="fas fa-envelope w-5"></i>
                    {{ 'nav.contact' | translate }}
                  </button>
                </li>
              </ul>
            </nav>

            <!-- Controles Mobile (Idioma e Tema) -->
            <div class="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <div>
                <label 
                  for="language-select"
                  class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  {{ 'language' | translate }}
                </label>
                <select
                  id="language-select"
                  [value]="currentLang"
                  (change)="switchLang($event)"
                  class="w-full p-3 rounded-lg bg-primary-50 dark:text-neutral-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 focus:ring-2 focus:ring-primary-500 transition-all"
                >
                  <option value="pt">🇧🇷 Português</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="fr">🇫🇷 Français</option>
                </select>
              </div>

              <button
                class="w-full p-3 rounded-lg flex items-center justify-between bg-primary-100 dark:text-neutral-100 dark:bg-primary-800/40 border border-primary-200 dark:border-primary-700 transition-all"
                (click)="toggleTheme()"
                (keyup.enter)="toggleTheme()"
                (keyup.space)="toggleTheme()"
              >
                <span>{{ 'theme' | translate }}</span>
                <i [class]="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
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
        color: #6366f1;
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
        background: linear-gradient(90deg, #6366f1, #a855f7);
        box-shadow: 0 0 12px rgba(168, 85, 247, 0.18);
      }

      @keyframes text-glow {
        0%,
        100% {
          color: #6366f1;
          text-shadow: 0 0 6px rgba(99, 102, 241, 0.22);
        }
        50% {
          color: #a855f7;
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.32);
        }
      }

      @media (max-width: 1024px) {
        .nav-scroll-wrapper {
          max-width: 42vw;
        }
      }
    `,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private nav = inject(NavService);
  private theme = inject(ThemeService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  activeSection = 'hero';
  currentLang = this.translate.currentLang || 'pt';
  isDark = this.theme.getCurrentTheme() === 'dark';
  isMobileMenuOpen = false;

  ngOnInit() {
    this.translate.setDefaultLang(this.currentLang);
    this.translate.use(this.currentLang);

    this.nav.active$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((s) => {
        this.activeSection = s;
        this.cdr.markForCheck();
      });

    this.theme.theme$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((t) => {
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
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  navigateTo(section: string) {
    this.scrollTo(section);
    this.closeMobileMenu();
  }

  switchLang(e: Event) {
    const target = e.target as HTMLSelectElement;
    if (target) {
      const v = target.value;
      this.currentLang = v;
      this.translate.use(v);
      document.documentElement.lang = v;
      this.cdr.markForCheck();
    }
  }

  toggleTheme() {
    this.theme.toggleTheme();
    this.cdr.markForCheck();
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
    const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
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