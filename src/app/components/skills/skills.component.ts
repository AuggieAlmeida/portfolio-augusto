// skills.component.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';

import skillsData from './skills.json';

interface SkillItem {
  name: string;
  icon?: string;
  level?: number;
  descriptionKey?: string;
}

interface SkillsData {
  categories: SkillCategory[];
  languages: LanguageItem[];
}

interface SkillCategory {
  key: string;
  label?: string;
  items: SkillItem[];
}

interface LanguageItem {
  nameKey: string;
  level: 'native' | 'advanced' | 'intermediate' | 'basic';
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      id="skills"
      class="skills py-12 px-4 md:px-8 lg:px-16"
      aria-labelledby="skills-title"
    >
      <div>
        <div
          class="rounded-2xl p-8 md:p-10 bg-white dark:bg-neutral-900 shadow-xl border border-primary-100 dark:border-primary-800"
        >
          <h2
            id="skills-title"
            class="section-title text-3xl font-heading mb-6 text-neutral-900 dark:text-neutral-100"
          >
            {{ 'skills.title' | translate }}
          </h2>

          <p class="text-neutral-600 dark:text-neutral-300 mb-6">
            {{ 'skills.intro' | translate }}
          </p>

          <div class="space-y-8">
            <div
              *ngFor="
                let cat of skills;
                trackBy: trackByCategory;
                let categoryIndex = index
              "
              class="grid grid-cols-12 gap-6 items-start"
            >
              <div
                class="col-span-12 md:col-span-3 flex items-center md:flex-col md:items-start"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-xl bg-neutral-900/50 flex items-center justify-center shadow-glow"
                  >
                    <i
                      class="fas fa-folder-open text-primary-400 text-lg"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div
                    class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
                  >
                    {{
                      ('skills.categories.' + cat.key | translate) || cat.label
                    }}
                  </div>
                </div>
              </div>

              <div class="col-span-12 md:col-span-9">
                <ng-container *ngIf="getRows(cat.items, 6) as rows">
                  <div
                    *ngFor="
                      let row of rows;
                      trackBy: trackByRow;
                      let rowIndex = index
                    "
                  >
                    <div
                      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                    >
                      <div
                        *ngFor="
                          let item of row;
                          trackBy: trackBySkill;
                          let skillIndex = index
                        "
                        class="skill-item opacity-0 animate-fade-in-up"
                        [style.animation-delay]="
                          getStaggerDelay(categoryIndex, rowIndex, skillIndex)
                        "
                      >
                        <button
                          class="skill-card h-full w-full group p-3 rounded-lg bg-neutral-100/5 dark:bg-neutral-900/40 border border-neutral-800 flex flex-col items-center justify-center gap-3 text-center transition-transform transform hover:-translate-y-1 hover:scale-105 hover:shadow-2xl hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                          [attr.aria-label]="item.name"
                          [attr.aria-describedby]="
                            item.descriptionKey
                              ? 'desc-' + slugify(item.name)
                              : null
                          "
                        >
                          <div
                            class="w-10 h-10 rounded-md bg-gradient-to-br from-neutral-800/60 to-neutral-800/40 flex items-center justify-center transition-transform group-hover:scale-110"
                          >
                            <i
                              *ngIf="item.icon"
                              [ngClass]="
                                item.icon + ' text-lg text-neutral-100'
                              "
                              aria-hidden="true"
                            ></i>
                            <div
                              *ngIf="!item.icon"
                              class="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center"
                            >
                              <i class="fas fa-question text-neutral-100"></i>
                            </div>
                          </div>

                          <div
                            class="font-medium text-sm text-neutral-900 dark:text-neutral-100"
                          >
                            {{ item.name }}
                          </div>

                          <!-- Tooltip (aparece ao hover / focus) -->
                          <div
                            *ngIf="item.descriptionKey"
                            role="tooltip"
                            [id]="'desc-' + slugify(item.name)"
                            class="absolute bottom-full mb-2 hidden group-hover:block group-focus:block bg-neutral-900 text-white text-xs rounded py-1 px-2 z-10 whitespace-normal max-w-xs"
                          >
                            {{ item.descriptionKey | translate }}
                            <div class="tooltip-arrow"></div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <hr
                      *ngIf="rowIndex < rows.length - 1"
                      class="my-4 border-neutral-200 dark:border-neutral-800"
                    />
                  </div>
                </ng-container>
              </div>
            </div>

            <div
              class="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800"
            >
              <h3
                class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6"
              >
                {{ 'skills.categories.languages.title' | translate }}
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  *ngFor="let lang of languages; trackBy: trackByLanguage"
                  class="flex items-center justify-between p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                >
                  <span
                    class="font-medium text-neutral-900 dark:text-neutral-100"
                  >
                    {{ lang.nameKey | translate }}
                  </span>
                  <span
                    class="text-sm text-primary-600 dark:text-primary-400 font-medium"
                  >
                    {{
                      'skills.categories.languages.level_' + lang.level
                        | translate
                    }}
                  </span>
                </div>
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
        animation: fadeInUp 0.5s ease forwards;
      }

      .tooltip-arrow {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 6px;
        border-style: solid;
        border-color: rgba(17, 24, 39, 1) transparent transparent transparent; /* neutral-900 */
      }

      .skill-card {
        position: relative;
      }
    `,
  ],
})
export class SkillsComponent {
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  public skills: SkillCategory[] = (skillsData as SkillsData).categories || [];
  public languages: LanguageItem[] = (skillsData as SkillsData).languages || [];

  private rowsCache = new Map<string, unknown>();

  // Calcula delay para animações
  getStaggerDelay(
    categoryIndex: number,
    rowIndex: number,
    skillIndex: number,
  ): string {
    const baseDelay = categoryIndex * 0.1 + rowIndex * 0.05 + skillIndex * 0.03;
    return `${baseDelay}s`;
  }

  // trackBy helpers
  trackByCategory(index: number, cat: SkillCategory): string {
    return cat.key;
  }

  trackBySkill(index: number, item: SkillItem): string {
    return item.name;
  }

  trackByRow(index: number, row: SkillItem[]): string {
    return row.map((item) => item.name).join('-');
  }

  trackByLanguage(index: number, lang: LanguageItem): string {
    return lang.nameKey;
  }

  // E atualize o método getRows para:
  getRows<T>(items: T[], size = 6): T[][] {
    const cacheKey = JSON.stringify(items) + size;

    // Verifique se já temos este cache
    const cached = this.rowsCache.get(cacheKey);
    if (cached !== undefined) {
      return cached as T[][];
    }

    if (!items || items.length === 0) return [];

    const out: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      out.push(items.slice(i, i + size));
    }

    this.rowsCache.set(cacheKey, out);
    return out;
  }

  // Método público para gerar slugs seguros para uso em IDs/aria-describedby
  public slugify(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, ''); // Removed unnecessary escape
  }
}
