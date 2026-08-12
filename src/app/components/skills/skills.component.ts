// skills.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import skillsData from './skills.json';

interface SkillItem {
  name: string;
  icon?: string;
  level?: number;
  descriptionKey?: string;
  category: string;
  /** Competência sustentada por case publicado; é o recorte que abre a seção. */
  core?: boolean;
}

interface SkillsData {
  categories: SkillCategory[];
  languages: LanguageItem[];
}

interface SkillCategory {
  key: string;
  label?: string;
  icon?: string;
  items: SkillItem[];
}

interface LanguageItem {
  nameKey: string;
  level: 'native' | 'advanced' | 'intermediate' | 'basic';
  cefr?: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="skills"
      class="skills py-8 md:py-12 px-3 md:px-8 lg:px-16 dark:bg-primary-950 bg-primary-200"
      aria-labelledby="skills-title"
    >
      <div
        class='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-30'
      ></div>

      <div>
        <div
          class="container mx-auto rounded-xl md:rounded-2xl p-4 md:p-8 lg:p-10 bg-white dark:bg-primary-800 shadow-xl border border-primary-100 dark:border-primary-600"
        >
          <h2
            id="skills-title"
            class="section-title text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 md:mb-6 text-center md:text-left"
          >
            <span class="font-display text-secondary-600 dark:text-secondary-400">✦</span>
            {{ 'skills.title' | translate }}
          </h2>

          <p
            class="text-sm md:text-base text-neutral-600 dark:text-neutral-300 mb-6 md:mb-8 text-center md:text-left"
          >
            {{ 'skills.intro' | translate }}
          </p>

          <div class="flex flex-col lg:grid lg:grid-cols-4 gap-4 md:gap-6">
            <!-- Skills Section -->
            <div
              class="order-2 lg:order-1 lg:col-span-3 bg-primary-200 dark:bg-primary-200/30 p-4 md:p-6 rounded-xl"
            >
              <!-- Filter Buttons -->
              <div class="mb-4 md:mb-6">
                <!-- Mobile: Horizontal scroll -->
                <div class="md:hidden overflow-x-auto pb-2">
                  <div class="flex gap-2 min-w-max">
                    <button
                      (click)="setActiveFilter('core')"
                      [class]="getFilterButtonClass('core')"
                      class="px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm whitespace-nowrap flex-shrink-0"
                    >
                      <i class="fas fa-bolt mr-2" aria-hidden="true"></i>
                      {{ 'skills.filter.core' | translate }}
                    </button>

                    <button
                      (click)="setActiveFilter('all')"
                      [class]="getFilterButtonClass('all')"
                      class="px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm whitespace-nowrap flex-shrink-0"
                    >
                      <i class="fas fa-globe mr-2" aria-hidden="true"></i>
                      {{ 'skills.filter.all' | translate: inventoryParams }}
                    </button>

                    @for (category of skillCategories; track category.key) {
                      <button
                        (click)="setActiveFilter(category.key)"
                        [class]="getFilterButtonClass(category.key)"
                        class="px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm whitespace-nowrap flex-shrink-0"
                      >
                        @if (category.icon) {
                          <i [ngClass]="category.icon + ' mr-2'" aria-hidden="true"></i>
                        }
                        {{ ('skills.categories.' + category.key | translate) || category.label }}
                      </button>
                    }
                  </div>
                </div>

                <!-- Desktop: Flex wrap -->
                <div class="hidden md:flex flex-wrap gap-2 justify-center lg:justify-start">
                  <button
                    (click)="setActiveFilter('core')"
                    [class]="getFilterButtonClass('core')"
                    class="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                  >
                    <i class="fas fa-bolt mr-2" aria-hidden="true"></i>
                    {{ 'skills.filter.core' | translate }}
                  </button>

                  <button
                    (click)="setActiveFilter('all')"
                    [class]="getFilterButtonClass('all')"
                    class="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                  >
                    <i class="fas fa-globe mr-2" aria-hidden="true"></i>
                    {{ 'skills.filter.all' | translate: inventoryParams }}
                  </button>

                  @for (category of skillCategories; track category.key) {
                    <button
                      (click)="setActiveFilter(category.key)"
                      [class]="getFilterButtonClass(category.key)"
                      class="px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                      @if (category.icon) {
                        <i [ngClass]="category.icon + ' mr-2'" aria-hidden="true"></i>
                      }
                      {{ ('skills.categories.' + category.key | translate) || category.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Skills Grid -->
              <div class="">
                <div
                  class="grid gap-2 md:gap-3 grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-12"
                >
                  @for (
                    skill of filteredSkills;
                    track skill.name + '-' + skill.category;
                    let i = $index
                  ) {
                    <div
                      class="skill-item opacity-0 animate-fade-in-up"
                      [style.animation-delay]="getStaggerDelay(i)"
                    >
                      <button
                        class="skill-card h-full w-full group p-3 md:p-4 rounded-lg bg-white dark:bg-primary-800/60 border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center gap-2 md:gap-3 text-center transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 min-h-[90px] md:min-h-[100px]"
                        [attr.aria-label]="skill.name"
                        [attr.aria-describedby]="
                          skill.descriptionKey ? 'desc-' + slugify(skill.name) : null
                        "
                      >
                        <div
                          class="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-neutral-700/80 to-neutral-800/80 flex items-center justify-center transition-transform group-hover:scale-110"
                        >
                          @if (skill.icon) {
                            <i
                              [ngClass]="skill.icon + ' text-lg md:text-xl text-white'"
                              aria-hidden="true"
                            ></i>
                          }
                          @if (!skill.icon) {
                            <div
                              class="w-6 h-6 md:w-8 md:h-8 bg-neutral-600 rounded flex items-center justify-center"
                            >
                              <i
                                aria-hidden="true"
                                class="fas fa-question text-xs md:text-sm text-white"
                              ></i>
                            </div>
                          }
                        </div>

                        <div
                          class="font-medium text-xs md:text-sm text-neutral-900 dark:text-neutral-100 leading-tight px-1"
                        >
                          {{ skill.name }}
                        </div>

                        <!-- Tooltip (apenas desktop) -->
                        @if (skill.descriptionKey) {
                          <div
                            role="tooltip"
                            [id]="'desc-' + slugify(skill.name)"
                            class="hidden md:group-hover:block md:group-focus:block absolute bottom-full mb-2 bg-neutral-800 dark:bg-neutral-700 text-white text-xs rounded py-2 px-3 z-10 whitespace-normal max-w-xs shadow-lg"
                          >
                            {{ skill.descriptionKey | translate }}
                            <div class="tooltip-arrow"></div>
                          </div>
                        }
                      </button>
                    </div>
                  }
                </div>

                <!-- Empty State -->
                @if (filteredSkills.length === 0) {
                  <div class="text-center py-8 text-neutral-500 dark:text-neutral-400">
                    <i aria-hidden="true" class="fas fa-search text-2xl md:text-3xl mb-4"></i>
                    <p class="text-sm md:text-base">{{ 'skills.no_results' | translate }}</p>
                  </div>
                }
              </div>
            </div>

            <!-- Languages and Soft Skills Section -->
            <div
              class="order-1 lg:order-2 flex flex-col bg-primary-200 dark:bg-primary-200/30 p-4 md:p-6 rounded-xl"
            >
              <!-- Languages Section -->
              <div class="flex flex-col">
                <h3
                  class="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3 md:mb-4 text-center"
                >
                  {{ 'skills.languages.title' | translate }}
                </h3>

                <div class="grid grid-cols-1 gap-2 md:gap-3">
                  @for (lang of languages; track lang.nameKey) {
                    <div
                      class="flex items-center p-3 rounded-lg bg-white dark:bg-primary-800/60 border border-neutral-200 dark:border-neutral-700 transition-colors hover:border-primary-400"
                    >
                      <span
                        class="font-medium text-sm md:text-base text-neutral-900 dark:text-neutral-100 flex-1"
                      >
                        {{ lang.nameKey | translate }}
                      </span>
                      <span
                        class="text-xs md:text-sm px-2 md:px-3 py-1 rounded-md font-medium min-w-[85px] md:min-w-[115px] text-center"
                        [class]="getLevelBadgeClass(lang.level)"
                      >
                        {{ 'skills.languages.level_' + lang.level | translate }}
                        @if (lang.cefr) {
                          <span class="opacity-70"> · {{ lang.cefr }}</span>
                        }
                      </span>
                    </div>
                  }
                </div>
              </div>

              <!-- Antes eram quatro rótulos genéricos — trabalho em equipe,
                   comunicação, resolução de problemas, adaptabilidade — que
                   qualquer currículo tem. Agora cada linha aponta para uma
                   evidência que já está publicada nesta página. -->
              <div
                class="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-neutral-300 dark:border-neutral-600"
              >
                <h3
                  class="text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3 md:mb-4 text-center"
                >
                  {{ 'skills.practice.title' | translate }}
                </h3>

                <ul class="grid grid-cols-1 gap-2">
                  @for (evidence of practiceKeys; track evidence) {
                    <li
                      class="p-3 rounded-lg bg-white dark:bg-primary-800/60 border border-neutral-200 dark:border-neutral-700"
                    >
                      <span class="text-xs md:text-sm text-neutral-900 dark:text-neutral-100">
                        {{ evidence | translate }}
                      </span>
                    </li>
                  }
                </ul>
              </div>
            </div>
          </div>
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
        animation: fadeInUp 0.4s ease forwards;
      }

      .tooltip-arrow {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 6px;
        border-style: solid;
        border-color: rgba(38, 38, 38, 1) transparent transparent transparent;
      }

      .skill-card {
        position: relative;
      }

      .skill-item {
        transition: all 0.2s ease;
      }

      /* Custom scrollbar for mobile filter buttons */
      .overflow-x-auto::-webkit-scrollbar {
        height: 4px;
      }

      .overflow-x-auto::-webkit-scrollbar-track {
        background: rgba(156, 163, 175, 0.2);
        border-radius: 2px;
      }

      .overflow-x-auto::-webkit-scrollbar-thumb {
        background: rgba(156, 163, 175, 0.5);
        border-radius: 2px;
      }

      .overflow-x-auto::-webkit-scrollbar-thumb:hover {
        background: rgba(156, 163, 175, 0.7);
      }

      /* Touch optimization for mobile */
      @media (max-width: 768px) {
        .skill-card {
          touch-action: manipulation;
        }

        button {
          touch-action: manipulation;
        }
      }
    `
  ]
})
export class SkillsComponent {
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  public skillCategories: SkillCategory[] = (skillsData as SkillsData).categories || [];
  public languages: LanguageItem[] = (skillsData as SkillsData).languages || [];

  // Lista completa de skills com categoria
  public allSkills: SkillItem[] = [];
  public coreSkills: SkillItem[] = [];
  public filteredSkills: SkillItem[] = [];
  /** Abre no recorte curto: 64 ícones de uma vez não é competência, é ruído. */
  public activeFilter = 'core';
  public inventoryParams = { count: 0 };

  /** Como o Augusto trabalha, cada linha ancorada em algo já publicado aqui. */
  public readonly practiceKeys = [
    'skills.practice.teaching',
    'skills.practice.measure',
    'skills.practice.performance'
  ];

  constructor() {
    this.initializeSkills();
  }

  private initializeSkills(): void {
    // Flatten all skills and add category info
    this.allSkills = this.skillCategories.reduce((acc: SkillItem[], category) => {
      const skillsWithCategory = category.items.map((item) => ({
        ...item,
        category: category.key
      }));
      return [...acc, ...skillsWithCategory];
    }, []);

    this.coreSkills = this.allSkills.filter((skill) => skill.core);
    this.inventoryParams = { count: this.allSkills.length };
    this.filteredSkills = this.coreSkills;
  }

  setActiveFilter(filter: string): void {
    this.activeFilter = filter;

    if (filter === 'core') {
      this.filteredSkills = this.coreSkills;
    } else if (filter === 'all') {
      this.filteredSkills = this.allSkills;
    } else {
      this.filteredSkills = this.allSkills.filter((skill) => skill.category === filter);
    }

    this.cdr.markForCheck();
  }

  getFilterButtonClass(filter: string): string {
    const baseClasses =
      'px-4 py-2 md:py-2 rounded-lg font-medium transition-all duration-200 text-sm';

    if (this.activeFilter === filter) {
      return `${baseClasses} bg-primary-600 text-white shadow-md transform scale-105`;
    }

    return `${baseClasses} bg-neutral-100 dark:bg-primary-800/50 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-700/50 hover:scale-102 active:scale-95`;
  }

  getLevelBadgeClass(level: string): string {
    const baseClasses = 'text-xs md:text-sm px-2 md:px-2 py-1 rounded-md font-medium';

    switch (level) {
      case 'native':
        return `${baseClasses} bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400`;
      case 'advanced':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`;
      case 'intermediate':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 'basic':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
      default:
        return `${baseClasses} bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400`;
    }
  }

  getStaggerDelay(index: number): string {
    return `${index * 0.05}s`;
  }

  public slugify(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
