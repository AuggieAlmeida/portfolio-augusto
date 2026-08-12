import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NavService } from '../../core/services/nav.service';
import { ThemeService } from '../../core/services/theme.service';

interface RoadmapYear {
  year: string;
  titleKey?: string;
  isCurrentYear?: boolean;
  skillsKeys: string[];
  position?: string;
  company?: string;
}

@Component({
  selector: 'app-career',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="career"
      data-section="career"
      class="career-roadmap py-8 md:py-12 px-3 md:px-8 lg:px-16 bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 dark:from-secondary-950 dark:via-primary-950 dark:to-accent-950 relative overflow-hidden"
      aria-labelledby="roadmap-title"
    >
      <!-- Background Pattern -->
      <div
        class='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-30'
      ></div>

      <!-- Animated background gradient -->
      <div
        class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-secondary-100/20 via-transparent to-primary-100/20 dark:from-secondary-800/20 dark:to-primary-800/20 animate-pulse-slow"
      ></div>

      <div class="relative z-10 container mx-auto">
        <!-- Header -->
        <div class="text-center mb-8 md:mb-12">
          <h2
            id="roadmap-title"
            class="section-title text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-4"
          >
            <span class="font-display text-secondary-600 dark:text-secondary-400">✦</span>
            {{ 'roadmap.title' | translate }}
          </h2>
          <p class="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            {{ 'roadmap.subtitle' | translate }}
          </p>
        </div>

        <!-- Desktop Timeline -->
        <div class="hidden lg:block">
          <div class="relative">
            <!-- Timeline Line -->
            <div
              class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-secondary-400 via-primary-400 to-accent-400 rounded-full"
            ></div>

            <div class="space-y-12">
              @for (item of visibleRoadmap; track item.year; let i = $index) {
                <!-- Um atributo class só. Eram dois, e o Angular fica com o
                     último: roadmap-item, opacity-0 e animate-fade-in-up eram
                     descartados em silêncio, então a timeline de desktop nunca
                     fazia o fade-in escalonado que a de mobile faz, e o
                     animation-delay ao lado não atrasava coisa nenhuma. -->
                <div
                  class="roadmap-item opacity-0 animate-fade-in-up flex items-center"
                  [style.animation-delay]="getStaggerDelay(i)"
                  [class.flex-row-reverse]="i % 2 === 0"
                  [class.flex-row]="i % 2 !== 0"
                >
                  <!-- Content Card -->
                  <div
                    class="w-5/12"
                    [class.text-right]="i % 2 === 0"
                    [class.text-left]="i % 2 !== 0"
                  >
                    <div
                      class="roadmap-card bg-white dark:bg-primary-800 rounded-xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      [class]="
                        item.isCurrentYear
                          ? 'border-accent-400 dark:border-accent-500 ring-2 ring-accent-200 dark:ring-accent-800'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                      "
                    >
                      <!-- Year Badge -->
                      <div
                        class="flex items-center gap-3 mb-4"
                        [class.justify-end]="i % 2 === 0"
                        [class.justify-start]="i % 2 !== 0"
                      >
                        <div
                          class="year-badge px-4 py-2 rounded-full font-bold text-sm"
                          [class]="
                            item.isCurrentYear
                              ? 'bg-accent-500 text-white shadow-lg'
                              : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                          "
                        >
                          {{ item.year
                          }}{{ item.titleKey ? ' · ' + (item.titleKey | translate) : '' }}
                        </div>

                        @if (item.isCurrentYear) {
                          <div class="flex items-center">
                            <div class="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                            <div
                              class="w-2 h-2 bg-accent-400 rounded-full animate-pulse ml-1"
                              style="animation-delay: 0.2s"
                            ></div>
                            <div
                              class="w-2 h-2 bg-accent-300 rounded-full animate-pulse ml-1"
                              style="animation-delay: 0.4s"
                            ></div>
                          </div>
                        }
                      </div>

                      <!-- Position Info -->
                      @if (item.position) {
                        <div class="mb-4">
                          <h4
                            class="font-semibold text-neutral-900 dark:text-neutral-100 text-lg mb-1"
                          >
                            {{ item.position | translate }}
                          </h4>
                          @if (item.company) {
                            <p class="text-sm text-neutral-600 dark:text-neutral-400">
                              {{
                                item.company.startsWith('roadmap.')
                                  ? (item.company | translate)
                                  : item.company
                              }}
                            </p>
                          }
                        </div>
                      }

                      <!-- Skills -->
                      <div
                        class="flex flex-wrap gap-2"
                        [class.justify-end]="i % 2 === 0"
                        [class.justify-start]="i % 2 !== 0"
                      >
                        @for (skillKey of item.skillsKeys; track skillKey) {
                          <span
                            class="skill-tag px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200"
                            [class]="
                              item.isCurrentYear
                                ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300 hover:bg-accent-200 dark:hover:bg-accent-800/50'
                                : 'bg-primary-100 text-primary-700 dark:bg-primary-800/50 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700/50'
                            "
                          >
                            {{ skillKey | translate }}
                          </span>
                        }
                      </div>
                    </div>
                  </div>

                  <!-- Timeline Dot -->
                  <div class="w-2/12 flex justify-center">
                    <div
                      class="timeline-dot w-6 h-6 rounded-full border-4 transition-all duration-300"
                      [class]="
                        item.isCurrentYear
                          ? 'bg-accent-500 border-white dark:border-primary-900 shadow-lg shadow-accent-500/50 animate-pulse'
                          : 'bg-secondary-400 border-white dark:border-primary-900 hover:scale-110'
                      "
                    ></div>
                  </div>

                  <!-- Spacer for alternating layout -->
                  <div class="w-5/12"></div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Mobile Timeline -->
        <div class="block lg:hidden">
          <div class="relative">
            <!-- Mobile Timeline Line -->
            <div
              class="absolute left-6 top-0 w-0.5 h-full bg-gradient-to-b from-secondary-400 via-primary-400 to-accent-400 rounded-full"
            ></div>

            <div class="space-y-8">
              @for (item of visibleRoadmap; track item.year; let i = $index) {
                <div
                  class="roadmap-item opacity-0 animate-fade-in-up flex items-start pl-14"
                  [style.animation-delay]="getStaggerDelay(i)"
                >
                  <!-- Timeline Dot -->
                  <div
                    class="timeline-dot w-4 h-4 rounded-full border-3 absolute left-4 transition-all duration-300"
                    [class]="
                      item.isCurrentYear
                        ? 'bg-accent-500 border-white dark:border-primary-900 shadow-lg shadow-accent-500/50 animate-pulse'
                        : 'bg-secondary-400 border-white dark:border-primary-900'
                    "
                  ></div>

                  <!-- Content Card -->
                  <div class="flex-1">
                    <div
                      class="roadmap-card bg-white dark:bg-primary-800 rounded-xl p-4 md:p-6 shadow-lg border transition-all duration-300"
                      [class]="
                        item.isCurrentYear
                          ? 'border-accent-400 dark:border-accent-500 ring-2 ring-accent-200 dark:ring-accent-800'
                          : 'border-neutral-200 dark:border-neutral-700'
                      "
                    >
                      <!-- Year Badge -->
                      <div class="flex items-center gap-3 mb-3">
                        <div
                          class="year-badge px-3 py-1 rounded-full font-bold text-xs md:text-sm"
                          [class]="
                            item.isCurrentYear
                              ? 'bg-accent-500 text-white shadow-lg'
                              : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                          "
                        >
                          {{ item.year
                          }}{{ item.titleKey ? ' · ' + (item.titleKey | translate) : '' }}
                        </div>

                        @if (item.isCurrentYear) {
                          <div class="flex items-center">
                            <div class="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse"></div>
                            <div
                              class="w-1.5 h-1.5 bg-accent-400 rounded-full animate-pulse ml-1"
                              style="animation-delay: 0.2s"
                            ></div>
                            <div
                              class="w-1.5 h-1.5 bg-accent-300 rounded-full animate-pulse ml-1"
                              style="animation-delay: 0.4s"
                            ></div>
                          </div>
                        }
                      </div>

                      <!-- Position Info -->
                      @if (item.position) {
                        <div class="mb-3">
                          <h4
                            class="font-semibold text-neutral-900 dark:text-neutral-100 text-base md:text-lg mb-1"
                          >
                            {{ item.position | translate }}
                          </h4>
                          @if (item.company) {
                            <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                              {{
                                item.company.startsWith('roadmap.')
                                  ? (item.company | translate)
                                  : item.company
                              }}
                            </p>
                          }
                        </div>
                      }

                      <!-- Skills -->
                      <div class="flex flex-wrap gap-1.5 md:gap-2">
                        @for (skillKey of item.skillsKeys; track skillKey) {
                          <span
                            class="skill-tag px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200"
                            [class]="
                              item.isCurrentYear
                                ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300'
                                : 'bg-primary-100 text-primary-700 dark:bg-primary-800/50 dark:text-primary-300'
                            "
                          >
                            {{ skillKey | translate }}
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-center md:mt-10">
          <button
            type="button"
            data-history-toggle
            class="inline-flex items-center gap-2 rounded-lg border border-secondary-300 px-5 py-3 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:border-secondary-600 dark:text-secondary-200 dark:hover:bg-secondary-900/30"
            (click)="toggleHistory()"
            [attr.aria-expanded]="showHistory"
          >
            <i
              aria-hidden="true"
              class="fas"
              [class.fa-chevron-down]="!showHistory"
              [class.fa-chevron-up]="showHistory"
            ></i>
            {{
              showHistory
                ? ('roadmap.history.hide' | translate)
                : ('roadmap.history.show' | translate: historyParams)
            }}
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
      }

      .roadmap-card {
        transition: all 0.3s ease;
      }

      .roadmap-card:hover {
        transform: translateY(-4px);
        box-shadow:
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      .timeline-dot {
        transition: all 0.3s ease;
      }

      .skill-tag {
        transition: all 0.2s ease;
      }

      .skill-tag:hover {
        transform: scale(1.05);
      }

      /* Pulse animation for current year indicator */
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
      #career {
        scroll-margin-top: 80px;
      }

      /* Mobile optimizations */
      @media (max-width: 1023px) {
        .timeline-dot {
          margin-top: 0.25rem;
        }

        #career {
          scroll-margin-top: 70px;
        }
      }

      /* Touch optimization */
      @media (max-width: 768px) {
        .roadmap-card {
          touch-action: manipulation;
        }

        #career {
          scroll-margin-top: 60px;
        }
      }
    `
  ]
})
export class CareerRoadmapComponent {
  @ViewChild('careerSection', { static: true }) careerSection!: ElementRef;

  private cdr = inject(ChangeDetectorRef);
  private nav = inject(NavService);
  private theme = inject(ThemeService);

  /** Ordem cronológica reversa: quem lê começa pelo que vale mais hoje. A
   *  sequência antiga abria pelo estágio de 2020 e consumia altura demais
   *  antes de chegar ao emprego atual. */
  public readonly roadmapData: RoadmapYear[] = [
    {
      year: '01/2026',
      titleKey: 'roadmap.current_year',
      position: 'roadmap.positions.fullstack_developer',
      company: 'Stech Soluções Tecnológicas',
      isCurrentYear: true,
      skillsKeys: [
        'roadmap.workskills.typescript',
        'roadmap.workskills.react',
        'roadmap.workskills.nestjs',
        'roadmap.workskills.prisma',
        'roadmap.workskills.docker'
      ]
    },
    {
      year: '04/2025 – 06/2026',
      position: 'roadmap.positions.it_professor',
      company: 'roadmap.companies.cebrac',
      skillsKeys: [
        'roadmap.workskills.teaching',
        'roadmap.workskills.excel',
        'roadmap.workskills.powerbi',
        'roadmap.workskills.generative_ai',
        'roadmap.workskills.workshop_facilitation'
      ]
    },
    {
      year: '2025',
      position: 'roadmap.positions.test_engineer',
      company: 'Outlier',
      skillsKeys: [
        'roadmap.workskills.qa_automation',
        'roadmap.workskills.selenium',
        'roadmap.workskills.testing_frameworks',
        'roadmap.workskills.ci_cd'
      ]
    },
    {
      year: '04/2024 – 10/2024',
      position: 'roadmap.positions.frontend_developer',
      company: 'Make Acelerador de Vendas',
      skillsKeys: [
        'roadmap.workskills.html_css',
        'roadmap.workskills.javascript',
        'roadmap.workskills.php',
        'roadmap.workskills.wordpress',
        'roadmap.workskills.responsive_design'
      ]
    },
    {
      year: '06/2022 – 01/2024',
      position: 'roadmap.positions.fullstack_developer',
      company: 'Persys Projetos de Inovação Tecnológica',
      skillsKeys: [
        'roadmap.workskills.java',
        'roadmap.workskills.springboot',
        'roadmap.workskills.angular',
        'roadmap.workskills.sql',
        'roadmap.workskills.docker'
      ]
    },
    {
      year: '12/2021 – 06/2022',
      position: 'roadmap.positions.intern_sintel',
      company: 'Sintel S.A.',
      skillsKeys: [
        'roadmap.workskills.n1_support',
        'roadmap.workskills.monitoring',
        'roadmap.workskills.networks',
        'roadmap.workskills.troubleshooting'
      ]
    },
    {
      year: '12/2020 – 07/2021',
      position: 'roadmap.positions.intern_itau',
      company: 'Itaú Unibanco',
      skillsKeys: [
        'roadmap.workskills.bi',
        'roadmap.workskills.data_analysis',
        'roadmap.workskills.excel',
        'roadmap.workskills.sql_basics',
        'roadmap.workskills.powerbi'
      ]
    }
  ];

  /** As três experiências mais recentes ficam abertas; o histórico anterior
   *  entra por escolha de quem lê. */
  private static readonly RECENT = 3;

  public showHistory = false;
  public visibleRoadmap: RoadmapYear[] = this.roadmapData.slice(0, CareerRoadmapComponent.RECENT);
  public readonly historyParams = {
    count: this.roadmapData.length - CareerRoadmapComponent.RECENT
  };

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    this.visibleRoadmap = this.showHistory
      ? this.roadmapData
      : this.roadmapData.slice(0, CareerRoadmapComponent.RECENT);
    this.cdr.markForCheck();
  }

  // Theme toggle method - can be called from header
  toggleTheme(): void {
    this.theme.toggleTheme();
    this.cdr.detectChanges();
  }

  // Direct scroll to this component - can be called from header
  scrollToCareer(): void {
    if (this.careerSection?.nativeElement) {
      const headerHeight = document.querySelector('header')?.clientHeight || 64;
      const elementTop = this.careerSection.nativeElement.offsetTop;
      const offsetPosition = elementTop - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      this.pulseItem('career');
    }
  }

  // Alternative scroll method using NavService
  scrollToCareerWithService(): void {
    const headerHeight = document.querySelector('header')?.clientHeight || 64;
    this.nav.scrollTo('career', headerHeight - 20);
    this.pulseItem('career');
  }

  // Private helper methods
  private pulseItem(sectionId: string): void {
    const el =
      document.querySelector(`[data-section="${sectionId}"]`) ||
      document.querySelector(`#${sectionId}`);
    if (!el) return;

    el.classList.add('animate-pulse-slow');
    setTimeout(() => el.classList.remove('animate-pulse-slow'), 900);
  }

  // Template helper methods
  getStaggerDelay(index: number): string {
    return `${index * 0.2}s`;
  }
}
