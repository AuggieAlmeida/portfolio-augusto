import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { resolveImage } from '../../core/images/responsive-image';
import { NavService } from '../../core/services/nav.service';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="hero"
      class="hero-section relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      <!-- Container principal com overflow oculto -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Animated Background -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-950 dark:via-secondary-950 dark:to-accent-950"
        >
          <div
            class='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-30'
          ></div>
        </div>

        <!-- Elementos flutuantes: decoração pura, invisível para leitor de tela. -->
        <div class="absolute inset-0" aria-hidden="true" style="clip-path: inset(0 0 0 0);">
          <div
            class="animate-float absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-primary-200/30 blur-xl dark:bg-primary-700/30"
          ></div>
          <div
            class="animate-float-delayed absolute bottom-1/4 right-1/4 h-40 w-40 rounded-full bg-secondary-200/30 blur-xl dark:bg-secondary-700/30"
          ></div>
          <div
            class="animate-float-slow absolute left-1/3 top-1/2 h-24 w-24 rounded-full bg-accent-200/30 blur-lg dark:bg-accent-700/30"
          ></div>
          <div
            class="animate-float-slower absolute bottom-1/3 left-1/5 h-28 w-28 rounded-full bg-secondary-200/20 blur-lg dark:bg-secondary-700/20"
          ></div>
        </div>
      </div>

      <!-- Main Content. O padding de baixo reserva a faixa da seta: sem ele, a
           seta ancorada no rodapé da seção passava por cima das estatísticas. -->
      <div class="container relative z-10 mx-auto px-6 pb-24 pt-20 text-center md:pb-28">
        <div class="mx-auto max-w-4xl">
          <!-- Profile Picture -->
          <div class="mb-8 flex justify-center">
            <div class="group relative">
              <div
                class="h-48 w-48 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 p-1 shadow-2xl transition-all duration-500 group-hover:shadow-primary-500/25 dark:from-primary-600 dark:to-secondary-700"
              >
                <div
                  class="h-full w-full overflow-hidden rounded-full border-4 border-white dark:border-neutral-700"
                >
                  <picture>
                    <source type="image/avif" [srcset]="portrait.avif" sizes="192px" />
                    <source type="image/webp" [srcset]="portrait.webp" sizes="192px" />
                    <img
                      [src]="portrait.src"
                      alt="Augusto Almeida"
                      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      fetchpriority="high"
                      width="192"
                      height="192"
                    />
                  </picture>
                </div>
              </div>
              <div
                class="absolute inset-0 rounded-full bg-primary-400/20 blur-xl transition-all duration-500 group-hover:bg-primary-400/40 dark:bg-primary-600/20 dark:group-hover:bg-primary-600/40"
                aria-hidden="true"
              ></div>
            </div>
          </div>

          <!-- Main Title -->
          <h1 class="mb-6 text-6xl font-bold md:text-8xl">
            <span class="font-heading text-neutral-800 dark:text-neutral-100">Augusto</span>
            <span class="font-display text-7xl text-primary-600 dark:text-primary-400 md:text-9xl">
              Almeida</span
            >
          </h1>

          <!-- Subtítulo com o efeito de digitação das áreas, como antes. A
               implementação é que mudou: o texto agora é interpolado pelo
               Angular, o cursor é CSS puro e o timer vive num campo limpo no
               ngOnDestroy. A versão anterior criava span e style a cada 50 ms,
               forçava layout e deixava lixo no <head>. -->
          <div class="mb-4 min-h-[2.6rem] md:min-h-[3rem]">
            <p
              class="mx-auto max-w-3xl font-sans text-xl font-medium leading-relaxed text-neutral-700 dark:text-neutral-200 md:text-2xl"
              aria-live="off"
            >
              <span class="typewriter" [class.typewriter-idle]="!typing">{{ typed }}</span>
              <!-- Leitor de tela recebe a lista inteira uma vez, em vez de cada
                   letra sendo anunciada de novo. -->
              <span class="sr-only">{{ rolesLabel }}</span>
            </p>
          </div>

          <p
            class="mx-auto mb-12 max-w-2xl font-sans text-base text-neutral-500 dark:text-neutral-400"
          >
            {{ 'hero.positioning' | translate }}
          </p>

          <!-- CTA: a ação primária leva às provas, não ao inventário. -->
          <div
            class="mb-16 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          >
            <button
              class="btn-primary group w-full sm:w-auto"
              (click)="navigateToProjects()"
              [attr.aria-label]="'CTA.viewFeatured' | translate"
            >
              <span class="flex items-end justify-center gap-2">
                <i aria-hidden="true" class="fas fa-rocket h-5 w-5"></i>
                {{ 'CTA.viewFeatured' | translate }}
                <i
                  aria-hidden="true"
                  class="fas fa-arrow-right h-5 w-5 transition-transform group-hover:translate-x-1"
                ></i>
              </span>
            </button>
            <button
              class="btn-secondary group w-full sm:w-auto"
              (click)="navigateToContact()"
              [attr.aria-label]="'CTA.contactMe' | translate"
            >
              <span class="flex items-end justify-center gap-2">
                <i aria-hidden="true" class="fas fa-envelope h-5 w-5"></i>
                {{ 'CTA.contactMe' | translate }}
              </span>
            </button>
          </div>

          <!-- Baixar CV: botão de verdade na fileira dos CTAs, com escolha
               explícita de idioma em dois links nativos — o teclado já sabe
               operar link, e nenhum estado novo precisa ser mantido correto. -->
          <div
            class="mb-16 inline-flex flex-wrap items-center justify-center gap-2 rounded-lg border border-primary-300 px-3 py-2 dark:border-primary-600"
            role="group"
            [attr.aria-label]="'CTA.downloadCv' | translate"
          >
            <span class="text-sm font-semibold text-primary-700 dark:text-primary-200">
              <i aria-hidden="true" class="fas fa-file-alt mr-2"></i>
              {{ 'CTA.downloadCv' | translate }}
            </span>
            <a
              data-cv="pt-BR"
              href="assets/cv/Augusto-Almeida-CV-pt-BR.pdf"
              hreflang="pt-BR"
              type="application/pdf"
              download
              class="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
              [attr.aria-label]="'CTA.downloadCvPt' | translate"
            >
              PT-BR
            </a>
            <a
              data-cv="en"
              href="assets/cv/Augusto-Almeida-CV-en.pdf"
              hreflang="en"
              type="application/pdf"
              download
              class="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
              [attr.aria-label]="'CTA.downloadCvEn' | translate"
            >
              EN
            </a>
          </div>

          <!-- Stats. Nenhum é auto-elogio: os três apontam para algo medido ou
               contado. O terceiro é o único que o visitante confere sozinho —
               são os cards com demo pública que respondem 2xx, medidos em
               2026-08-12. Número exato, sem "+": se um domínio cair, o número
               cai junto, e é assim que ele continua verdadeiro. -->
          <div class="mx-auto grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
            <div class="group text-center">
              <div
                class="stat-number mb-2 font-heading text-4xl font-bold text-primary-600 transition-transform group-hover:scale-110 dark:text-primary-400"
                data-target="5"
              >
                5+
              </div>
              <div class="font-sans font-medium text-neutral-600 dark:text-neutral-400">
                {{ 'stats.yearsOfExperience' | translate }}
              </div>
            </div>
            <div class="group text-center">
              <div
                class="stat-number mb-2 font-heading text-4xl font-bold text-secondary-600 transition-transform group-hover:scale-110 dark:text-secondary-400"
                data-target="35"
              >
                35+
              </div>
              <div class="font-sans font-medium text-neutral-600 dark:text-neutral-400">
                {{ 'stats.completedProjects' | translate }}
              </div>
            </div>
            <div class="group text-center">
              <div
                class="mb-2 font-heading text-4xl font-bold text-accent-600 transition-transform group-hover:scale-110 dark:text-accent-400"
              >
                14
              </div>
              <div class="font-sans font-medium text-neutral-600 dark:text-neutral-400">
                {{ 'stats.liveProjects' | translate }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Arrow at Bottom -->
      <div class="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 transform">
        <div class="animate-bounce-slow">
          <button
            (click)="scrollToNextSection()"
            class="rounded-full p-2 text-neutral-600 transition-all duration-300 hover:scale-110 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 dark:text-neutral-400 dark:hover:text-primary-400"
            [attr.aria-label]="'navigation.scrollDown' | translate"
          >
            <i aria-hidden="true" class="fas fa-chevron-down text-3xl"></i>
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-section {
        overflow-x: hidden;
      }

      /* Cursor por CSS, ancorado no fim do texto. A versão anterior media a
         largura com um span temporário no body e injetava uma tag <style> nova
         a cada letra. */
      .typewriter::after {
        content: '|';
        margin-left: 2px;
        animation: blink 1s steps(1, end) infinite;
      }

      .typewriter-idle::after {
        animation: none;
        opacity: 0;
      }

      @keyframes blink {
        0%,
        50% {
          opacity: 1;
        }
        51%,
        100% {
          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .typewriter::after {
          animation: none;
        }
      }

      .animate-float {
        animation: float 6s ease-in-out infinite;
      }

      .animate-float-delayed {
        animation: float 6s ease-in-out infinite 2s;
      }

      .animate-float-slow {
        animation: float 8s ease-in-out infinite 1s;
      }

      .animate-float-slower {
        animation: float 10s ease-in-out infinite 3s;
      }

      @keyframes float {
        0%,
        100% {
          transform: translateY(-20px) translateX(0) rotate(0deg);
        }
        33% {
          transform: translateY(-30px) translateX(10px) rotate(5deg);
        }
        66% {
          transform: translateY(-25px) translateX(-10px) rotate(-5deg);
        }
      }

      .btn-primary:hover,
      .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }

      .animate-bounce-slow {
        animation: bounce-slow 3s ease-in-out infinite;
      }

      @keyframes bounce-slow {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .animate-float,
        .animate-float-delayed,
        .animate-float-slow,
        .animate-float-slower,
        .animate-bounce-slow {
          animation: none;
        }
      }

      @media (max-width: 768px) {
        .animate-float,
        .animate-float-delayed,
        .animate-float-slow,
        .animate-float-slower {
          animation-duration: 8s;
          transform: scale(0.8);
        }

        .hero-section .container {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .hero-section h1 {
          font-size: 3rem;
        }

        .hero-section h1 .font-display {
          font-size: 3.5rem;
        }

        .hero-section .h-48.w-48 {
          width: 10rem;
          height: 10rem;
        }

        .hero-section .grid-cols-1 {
          gap: 1.5rem;
        }
      }

      @media (max-width: 480px) {
        .hero-section h1 {
          font-size: 2.5rem;
        }

        .hero-section h1 .font-display {
          font-size: 3rem;
        }

        .hero-section .h-48.w-48 {
          width: 8rem;
          height: 8rem;
        }
      }
    `
  ],
  standalone: true,
  imports: [TranslateModule]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private nav = inject(NavService);
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  // O retrato aparece num círculo de 192 px; o master de 212 kB servia a mesma
  // imagem em qualquer tela.
  public readonly portrait = resolveImage('hero')!;

  /** Áreas que o subtítulo percorre. Nomes de cargo não se traduzem. */
  public readonly roles = [
    'Fullstack Developer',
    'Software Engineer',
    'Tech Enthusiast',
    'QA Analyst',
    'System Architect',
    'Problem Solver'
  ];
  public readonly rolesLabel = this.roles.join(', ');

  public typed = '';
  public typing = true;
  private roleIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private typeTimer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit() {
    this.animateCounters();
    this.startTypewriter();
  }

  ngOnDestroy() {
    // O campo é o mesmo que o timer usa; a versão anterior guardava um handle
    // de interval que nunca era o do setTimeout em execução.
    clearTimeout(this.typeTimer);
  }

  navigateToProjects(): void {
    this.scrollToSection('projects');
  }

  navigateToContact(): void {
    this.scrollToSection('contact');
  }

  scrollToNextSection(): void {
    this.scrollToSection('about');
  }

  private scrollToSection(sectionId: string): void {
    const headerHeight = document.querySelector('header')?.clientHeight || 64;
    this.nav.scrollTo(sectionId, headerHeight - 20);
  }

  /** Digita e apaga as áreas em ciclo. Só o texto muda: nada de span
   *  temporário no body, medição de largura ou tag <style> nova por letra. */
  private startTypewriter(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Sem animação, o subtítulo não pode ficar vazio.
      this.typed = this.roles[0];
      this.typing = false;
      this.cdr.markForCheck();
      return;
    }

    const TYPE_MS = 70;
    const DELETE_MS = 40;
    const HOLD_MS = 1400;
    const NEXT_MS = 320;

    const tick = () => {
      const role = this.roles[this.roleIndex];

      if (this.deleting) {
        this.charIndex -= 1;
      } else {
        this.charIndex += 1;
      }
      this.typed = role.slice(0, this.charIndex);
      this.cdr.markForCheck();

      let delay = this.deleting ? DELETE_MS : TYPE_MS;
      if (!this.deleting && this.charIndex === role.length) {
        this.deleting = true;
        delay = HOLD_MS;
      } else if (this.deleting && this.charIndex === 0) {
        this.deleting = false;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
        delay = NEXT_MS;
      }

      this.typeTimer = setTimeout(tick, delay);
    };

    tick();
  }

  /** Contador progressivo dos dois números medidos. O valor final já está no
   *  HTML: se o observador não rodar, o recrutador lê o número certo mesmo
   *  assim, e não um "0+". */
  private animateCounters(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const stats = this.host.nativeElement.querySelectorAll<HTMLElement>('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const stat = entry.target as HTMLElement;
        observer.unobserve(stat);
        const target = Number.parseInt(stat.dataset['target'] ?? '0', 10);
        const step = Math.max(1, Math.round(target / 40));
        let current = 0;

        const tick = () => {
          current = Math.min(target, current + step);
          stat.textContent = `${current}+`;
          if (current < target) requestAnimationFrame(tick);
        };

        tick();
      });
    });

    stats.forEach((stat) => observer.observe(stat));
  }
}
