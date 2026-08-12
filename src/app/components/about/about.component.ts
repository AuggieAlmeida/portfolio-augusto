import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="about"
      class="about reveal-section relative px-3 py-20 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-950 dark:via-secondary-950 dark:to-accent-950 overflow-hidden"
      aria-labelledby="about-title"
    >
      <!-- Background Pattern -->
      <div
        class='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-30'
      ></div>

      <!-- Animated background gradient -->
      <div
        class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-100/20 via-transparent to-secondary-100/20 dark:from-primary-800/20 dark:to-secondary-800/20 animate-pulse-slow"
      ></div>

      <div class="relative z-10 container mx-auto">
        <!-- Mesmo cabecalho centralizado das secoes de projetos e trajetoria;
             aqui o h2 estava solto e encostava na esquerda. -->
        <div class="text-center mb-8 md:mb-12">
          <h2
            id="about-title"
            class="section-title text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-4"
          >
            <span class="font-display text-primary-600 dark:text-primary-400">✦</span>
            {{ 'about.aboutMe' | translate }}
          </h2>
        </div>

        <div class="about-content">
          <!-- O rosto vive no hero, com foto real. Repetir retrato aqui só
               competia com o texto, que é o que esta seção precisa vender. -->
          <div
            class="about-text mx-auto max-w-4xl rounded-2xl p-6 md:p-8 lg:p-10 bg-white dark:bg-primary-800 shadow-xl border border-primary-100 dark:border-primary-600"
          >
            <!-- Greeting -->
            <p
              class="greeting text-lg md:text-2xl leading-relaxed text-neutral-700 dark:text-neutral-200 border-l-4 border-primary-500 pl-5 md:pl-7 mb-10"
            >
              {{ 'about.greeting' | translate }}
            </p>

            <!-- Duas colunas no desktop: sem a imagem, um bloco de texto único
                 deixava metade da largura sobrando em telas grandes. -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-10">
              <!-- Professional Overview -->
              <div class="professional-highlight">
                <h3
                  class="text-xl md:text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4 flex items-center gap-2"
                >
                  <i aria-hidden="true" class="fas fa-briefcase"></i>
                  {{ 'about.professionalOverview' | translate }}
                </h3>
                <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {{ 'about.professionalDescription' | translate }}
                </p>
              </div>

              <!-- Core Expertise -->
              <div class="expertise-section">
                <h3
                  class="text-xl md:text-2xl font-semibold text-secondary-600 dark:text-secondary-400 mb-4 flex items-center gap-2"
                >
                  <i aria-hidden="true" class="fas fa-code"></i>
                  {{ 'about.coreExpertise' | translate }}
                </h3>
                <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {{ 'about.expertiseDescription' | translate }}
                </p>
              </div>
            </div>

            <!-- Contato saiu daqui: os mesmos quatro canais já aparecem no
                 rodapé, e repetir a grade dobrava a altura da seção sem
                 acrescentar prova. O que sobra é tese curta e evidência. -->
            <a
              href="#projects"
              class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <i aria-hidden="true" class="fas fa-rocket"></i>
              {{ 'CTA.viewFeatured' | translate }}
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* Pulse animation for background gradient */
      @keyframes pulse-slow {
        0%,
        100% {
          opacity: 0.3;
        }
        50% {
          opacity: 0.1;
        }
      }

      .animate-pulse-slow {
        animation: pulse-slow 3s ease-in-out infinite;
      }

      /* Scroll target optimization */
      #about {
        scroll-margin-top: 80px;
      }

      @media (max-width: 1023px) {
        #about {
          scroll-margin-top: 70px;
        }
      }

      @media (max-width: 768px) {
        #about {
          scroll-margin-top: 60px;
        }
      }
    `
  ],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class AboutComponent {}
