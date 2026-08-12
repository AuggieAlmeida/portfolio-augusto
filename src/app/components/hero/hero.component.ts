import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NavService } from '../../core/services/nav.service';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="hero"
      class="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <!-- Container principal com overflow oculto -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Animated Background -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-950 dark:via-secondary-950 dark:to-accent-950"
        >
          <div
            class='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2322c55e" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-30'
          ></div>
          <div
            class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-100/20 via-transparent to-secondary-100/20 dark:from-primary-800/20 dark:to-secondary-800/20 mobile-pulse hero-background"
          ></div>
        </div>

        <!-- Container para elementos flutuantes com clip-path -->
        <div class="absolute inset-0" style="clip-path: inset(0 0 0 0);">
          <!-- Floating Elements com posições ajustadas -->
          <div
            class="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-200/30 dark:bg-primary-700/30 rounded-full blur-xl animate-float"
          ></div>
          <div
            class="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary-200/30 dark:bg-secondary-700/30 rounded-full blur-xl animate-float-delayed"
          ></div>
          <div
            class="absolute top-1/2 left-1/3 w-24 h-24 bg-accent-200/30 dark:bg-accent-700/30 rounded-full blur-lg animate-float-slow"
          ></div>
          <div
            class="absolute top-1/3 right-1/3 w-20 h-20 bg-primary-200/20 dark:bg-primary-700/20 rounded-full blur-lg animate-float-delayed"
          ></div>
          <div
            class="absolute bottom-1/3 left-1/5 w-28 h-28 bg-secondary-200/20 dark:bg-secondary-700/20 rounded-full blur-lg animate-float-slower"
          ></div>
          <div
            class="absolute top-2/5 right-1/4 w-16 h-16 bg-accent-200/25 dark:bg-accent-700/25 rounded-full blur-md animate-float"
          ></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- O resto do conteúdo permanece igual -->
        <div class="max-w-4xl mx-auto">
          <!-- Profile Picture -->
          <div class="mb-8 flex justify-center">
            <div class="relative group">
              <div
                class="w-48 h-48 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 dark:from-primary-600 dark:to-secondary-700 p-1 shadow-2xl group-hover:shadow-primary-500/25 transition-all duration-500"
              >
                <div
                  class="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-neutral-700"
                >
                  <img
                    src="assets/images/hero/hero.jpeg"
                    alt="Augusto Almeida - Fullstack Developer"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="eager"
                    width="192"
                    height="192"
                  />
                </div>
              </div>
              <!-- Glow effect -->
              <div
                class="absolute inset-0 rounded-full bg-primary-400/20 dark:bg-primary-600/20 blur-xl group-hover:bg-primary-400/40 dark:group-hover:bg-primary-600/40 transition-all duration-500"
              ></div>
            </div>
          </div>

          <!-- Main Title -->
          <h1 class="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            <span class="text-neutral-800 dark:text-neutral-100 font-heading">Augusto</span>
            <span class="text-primary-600 dark:text-primary-400 font-display text-7xl md:text-9xl">
              Almeida</span
            >
          </h1>

          <!-- Subtitle com efeito de palavras em fila -->
          <div class="mb-12 mt-6 min-h-[2.8rem]">
            <p
              class="text-xl text-neutral-500 dark:text-neutral-400  max-w-2xl mx-auto leading-relaxed animate-slide-up font-sans min-h-[2rem]"
            >
              <span class="font-medium typewriter"></span>
            </p>
          </div>

          <!-- CTA Buttons (botões full width no mobile) -->
          <div
            class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up w-full sm:w-auto"
          >
            <button
              class="btn-primary group w-full sm:w-auto"
              (click)="navigateToProjects()"
              [attr.aria-label]="'CTA.viewProjects' | translate"
            >
              <span class="flex items-end justify-center gap-2">
                <i aria-hidden="true" class="fas fa-rocket w-5 h-5"></i>
                {{ 'CTA.viewProjects' | translate }}
                <i
                  aria-hidden="true"
                  class="fas fa-arrow-right w-5 h-5 group-hover:translate-x-1 transition-transform"
                ></i>
              </span>
            </button>
            <button
              class="btn-secondary group w-full sm:w-auto"
              (click)="navigateToContact()"
              [attr.aria-label]="'CTA.contactMe' | translate"
            >
              <span class="flex items-end justify-center gap-2">
                <i aria-hidden="true" class="fas fa-envelope w-5 h-5"></i>
                {{ 'CTA.contactMe' | translate }}
                <i
                  aria-hidden="true"
                  class="fas fa-arrow-right w-5 h-5 group-hover:translate-x-1 transition-transform"
                ></i>
              </span>
            </button>
          </div>

          <!-- Stats com contador progressivo -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up">
            <div class="text-center group">
              <div
                class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform font-heading stat-number"
                data-target="5"
              >
                0+
              </div>
              <div class="text-neutral-600 dark:text-neutral-400 font-medium font-sans">
                {{ 'stats.yearsOfExperience' | translate }}
              </div>
            </div>
            <div class="text-center group">
              <div
                class="text-4xl font-bold text-secondary-600 dark:text-secondary-400 mb-2 group-hover:scale-110 transition-transform font-heading stat-number"
                data-target="32"
              >
                0+
              </div>
              <div class="text-neutral-600 dark:text-neutral-400 font-medium font-sans">
                {{ 'stats.completedProjects' | translate }}
              </div>
            </div>
            <div class="text-center group">
              <div
                class="text-4xl font-bold text-accent-600 dark:text-accent-400 mb-2 group-hover:scale-110 transition-transform font-heading stat-number"
                data-target="4"
              >
                0
              </div>
              <div class="text-neutral-600 dark:text-neutral-400 font-medium font-sans">
                {{ 'stats.languagesDominated' | translate }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Arrow at Bottom -->
      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div class="animate-bounce-slow">
          <button
            (click)="scrollToNextSection()"
            class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 rounded-full p-2"
            [attr.aria-label]="'navigation.scrollDown' | translate"
          >
            <i aria-hidden="true" class="fas fa-chevron-down text-3xl animate-float-arrow"></i>
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

      /* Estilos para o efeito de typewriter */
      .typewriter {
        display: inline-block;
        position: relative;
        text-align: center;
        height: 1.5em;
      }

      .typewriter::after {
        content: '|';
        position: absolute;
        right: 0;
        animation: blink 1s infinite;
      }

      @media (max-width: 768px) {
        .mobile-pulse {
          animation: none !important;
          background-size: 300% 300%;
        }

        @keyframes gradient-pulse-mobile {
          0% {
            background-position: 0% 50%;
            opacity: 0.8;
          }
          50% {
            background-position: 100% 50%;
            opacity: 1;
          }
          100% {
            background-position: 0% 50%;
            opacity: 0.8;
          }
        }

        /* Ajuste para elementos flutuantes no mobile */
        .animate-float,
        .animate-float-delayed,
        .animate-float-slow,
        .animate-float-slower {
          animation-duration: 8s;
          transform: scale(0.8);
        }
      }

      /* Desative a animação padrão do gradiente */
      .hero-background {
        animation: none;
        height: 100%;
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

      /* Button hover effects */
      .btn-primary:hover,
      .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      }

      /* Pulse effect for CTA buttons */
      .btn-primary {
        position: relative;
        overflow: hidden;
      }

      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }

      .btn-primary:hover::before {
        left: 100%;
      }

      /* Floating Arrow Animations */
      .animate-bounce-slow {
        animation: bounce-slow 3s ease-in-out infinite;
      }

      .animate-float-arrow {
        animation: float-arrow 2s ease-in-out infinite;
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

      @keyframes float-arrow {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }

      /* Mobile optimizations for floating arrow */
      @media (max-width: 768px) {
        .animate-bounce-slow {
          animation-duration: 2.5s;
        }

        .animate-float-arrow {
          animation-duration: 1.8s;
        }

        /* Adjust arrow position on mobile */
        .hero-section .absolute.bottom-8 {
          bottom: 1.5rem;
        }

        /* Smaller arrow on mobile */
        .hero-section .fas.fa-chevron-down {
          font-size: 1.5rem;
        }

        /* Better mobile spacing for main content */
        .hero-section .container {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        /* Adjust title sizes for mobile */
        .hero-section h1 {
          font-size: 3rem;
        }

        .hero-section h1 .font-display {
          font-size: 3.5rem;
        }

        /* Better mobile spacing for profile picture */
        .hero-section .w-48.h-48 {
          width: 10rem;
          height: 10rem;
        }

        /* Adjust stats grid for mobile */
        .hero-section .grid-cols-1 {
          gap: 1.5rem;
        }
      }

      /* Extra small mobile devices */
      @media (max-width: 480px) {
        .hero-section h1 {
          font-size: 2.5rem;
        }

        .hero-section h1 .font-display {
          font-size: 3rem;
        }

        .hero-section .w-48.h-48 {
          width: 8rem;
          height: 8rem;
        }

        .hero-section .text-xl {
          font-size: 1rem;
        }
      }
    `
  ],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private nav = inject(NavService);
  private wordEffectInterval: number | undefined;

  ngAfterViewInit() {
    this.addProgressiveCounter();
    this.addWordFadeEffect();
  }

  ngOnDestroy() {
    if (this.wordEffectInterval) {
      clearInterval(this.wordEffectInterval);
    }
  }

  // Navigation methods - same pattern as header component
  navigateToProjects(): void {
    this.scrollToSection('projects');
  }

  navigateToContact(): void {
    this.scrollToSection('about');
  }

  scrollToNextSection(): void {
    this.scrollToSection('about');
  }

  private scrollToSection(sectionId: string): void {
    const headerHeight = document.querySelector('header')?.clientHeight || 64;
    this.nav.scrollTo(sectionId, headerHeight - 20);
    this.pulseItem(sectionId);
  }

  private pulseItem(sectionId: string): void {
    const el = document.querySelector(`[data-section="${sectionId}"]`);
    if (!el) return;
    el.classList.add('animate-pulse-slow');
    setTimeout(() => el.classList.remove('animate-pulse-slow'), 900);
  }

  private addProgressiveCounter() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stat = entry.target as HTMLElement;
          const target = parseInt(stat.getAttribute('data-target') || '0');
          let count = 0;
          const duration = 2000;
          const increment = target / (duration / 16);

          const updateCount = () => {
            if (count <= target) {
              count += increment;
              stat.textContent = Math.ceil(count) + (target > 4 ? '+' : '');
              requestAnimationFrame(updateCount);
            } else {
              stat.textContent = target + (target > 4 ? '+' : '');
            }
          };

          updateCount();
          observer.unobserve(stat);
        }
      });
    });

    stats.forEach((stat) => observer.observe(stat));
  }

  private addWordFadeEffect() {
    const textElement = document.querySelector('.typewriter');
    if (!textElement) return;

    const words = [
      'Fullstack Developer',
      'Software Engineer',
      'Tech Enthusiast',
      'QA Analyst',
      'System Architect',
      'Problem Solver'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 50;
    const deleteSpeed = 50;
    const pauseTime = 1000;

    const type = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        // Modo apagamento
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        // Modo digitação
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }

      // Atualizar a posição do cursor
      this.updateCursorPosition(textElement as HTMLElement);

      let typeSpeed = isDeleting ? deleteSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        // Palavra completa, pausar antes de apagar
        typeSpeed = pauseTime;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Palavra completamente apagada, passar para a próxima
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    };

    // Iniciar imediatamente
    type();
  }

  private updateCursorPosition(textElement: HTMLElement) {
    // Criar um span temporário para medir a largura do texto
    const tempSpan = document.createElement('span');
    tempSpan.textContent = textElement.textContent;
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.font = window.getComputedStyle(textElement).font;

    document.body.appendChild(tempSpan);
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    // Atualizar a posição do cursor
    const style = document.createElement('style');
    style.textContent = `
    .typewriter::after {
      left: ${textWidth}px;
      right: auto;
    }
  `;

    // Remover estilos anteriores
    const existingStyle = document.getElementById('cursor-style');
    if (existingStyle) {
      existingStyle.remove();
    }

    style.id = 'cursor-style';
    document.head.appendChild(style);
  }
}
