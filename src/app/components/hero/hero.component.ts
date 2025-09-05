import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="hero"
      class="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <!-- Animated Background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-950 dark:via-secondary-950 dark:to-accent-950"
      >
        <div
          class='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-30'
        ></div>
        <div
          class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-100/20 via-transparent to-secondary-100/20 dark:from-primary-800/20 dark:to-secondary-800/20 animate-pulse-slow"
        ></div>
      </div>

      <!-- Floating Elements (mais elementos adicionados) -->
      <div
        class="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 dark:bg-primary-700/30 rounded-full blur-xl animate-float"
      ></div>
      <div
        class="absolute bottom-20 right-20 w-40 h-40 bg-secondary-200/30 dark:bg-secondary-700/30 rounded-full blur-xl animate-float-delayed"
      ></div>
      <div
        class="absolute top-1/2 left-1/4 w-24 h-24 bg-accent-200/30 dark:bg-accent-700/30 rounded-full blur-lg animate-float-slow"
      ></div>
      <div
        class="absolute top-1/3 right-1/4 w-20 h-20 bg-primary-200/20 dark:bg-primary-700/20 rounded-full blur-lg animate-float-delayed"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/3 w-28 h-28 bg-secondary-200/20 dark:bg-secondary-700/20 rounded-full blur-lg animate-float-slower"
      ></div>
      <div
        class="absolute top-1/4 right-1/3 w-16 h-16 bg-accent-200/25 dark:bg-accent-700/25 rounded-full blur-md animate-float"
      ></div>

      <!-- Main Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
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
            <span class="text-neutral-800 dark:text-neutral-100 font-heading"
              >Augusto</span
            >
            <span
              class="text-primary-600 dark:text-primary-400 font-display text-7xl md:text-9xl"
            >
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
            <button class="btn-primary group w-full sm:w-auto">
              <span class="flex items-center justify-center gap-2">
                <i class="fas fa-rocket w-5 h-5"></i>
                {{ 'CTA.viewProjects' | translate }}
                <i
                  class="fas fa-arrow-right w-5 h-5 group-hover:translate-x-1 transition-transform"
                ></i>
              </span>
            </button>
            <button class="btn-secondary group w-full sm:w-auto">
              <span class="flex items-center justify-center gap-2">
                <i class="fas fa-envelope w-5 h-5"></i>
                {{ 'CTA.contactMe' | translate }}
                <i
                  class="fas fa-arrow-right w-5 h-5 group-hover:translate-x-1 transition-transform"
                ></i>
              </span>
            </button>
          </div>

          <!-- Stats com contador progressivo -->
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up"
          >
            <div class="text-center group">
              <div
                class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform font-heading stat-number"
                data-target="5"
              >
                0+
              </div>
              <div
                class="text-neutral-600 dark:text-neutral-400 font-medium font-sans"
              >
                {{ 'stats.yearsOfExperience' | translate }}
              </div>
            </div>
            <div class="text-center group">
              <div
                class="text-4xl font-bold text-secondary-600 dark:text-secondary-400 mb-2 group-hover:scale-110 transition-transform font-heading stat-number"
                data-target="20"
              >
                0+
              </div>
              <div
                class="text-neutral-600 dark:text-neutral-400 font-medium font-sans"
              >
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
              <div
                class="text-neutral-600 dark:text-neutral-400 font-medium font-sans"
              >
                {{ 'stats.languagesDominated' | translate }}
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div
            class="flex justify-center space-x-6 mt-12 mb-6 animate-slide-up"
          >
            <a
              href="https://github.com/AuggieAlmeida"
              target="_blank"
              class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <i class="fab fa-square-github text-2xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/augustobalmeida/"
              target="_blank"
              class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <i class="fab fa-linkedin text-2xl"></i>
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=5511916047732&text&type=phone_number&app_absent=0"
              target="_blank"
              class="text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <i class="fab fa-square-whatsapp text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
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
          transform: translateY(-50px) rotate(0deg);
        }
        33% {
          transform: translateY(-70px) rotate(120deg);
        }
        66% {
          transform: translateY(-60px) rotate(240deg);
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
    `,
  ],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class HeroComponent implements AfterViewInit, OnDestroy {
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
      'Problem Solver',
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
      this.updateCursorPosition(textElement);

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

  private updateCursorPosition(textElement: Element) {
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
