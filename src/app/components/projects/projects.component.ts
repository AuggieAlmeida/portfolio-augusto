import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PortfolioCommandService } from '../../core/commands/portfolio-command.service';
import { ProjectCatalogService, ProjectItem } from '../../core/projects/project-catalog.service';
import { ScrollLockService } from '../../core/services/scroll-lock.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Um cartão só, reaproveitado pelo destaque e pelos dois carrosséis.
         Antes a mesma marcação vivia copiada três vezes. -->
    <ng-template #projectCard let-project>
      <div
        class="project-card-inner group h-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-neutral-700 dark:bg-primary-800"
      >
        <div class="relative overflow-hidden">
          <picture *ngIf="project.cover; else coverFallback">
            <source type="image/avif" [srcset]="project.cover.avif" [attr.sizes]="cardSizes" />
            <source type="image/webp" [srcset]="project.cover.webp" [attr.sizes]="cardSizes" />
            <img
              [src]="project.cover.src"
              [alt]="imageAlt(project)"
              [width]="project.cover.width"
              [height]="project.cover.height"
              class="project-image h-48 w-full object-cover transition-transform duration-500 md:h-56"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <ng-template #coverFallback>
            <div
              class="project-image bg-gradient-primary flex h-48 w-full items-center justify-center transition-transform duration-500 md:h-56"
              aria-hidden="true"
            >
              <span class="font-heading text-5xl font-bold tracking-widest text-white/90">
                {{ initials(project) }}
              </span>
            </div>
          </ng-template>

          <div
            class="project-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300"
          ></div>

          <div class="absolute left-3 top-3">
            <div
              class="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white shadow-lg"
              [class.bg-primary-500]="project.category === 'commercial'"
              [class.bg-secondary-500]="project.category === 'study'"
            >
              <i
                aria-hidden="true"
                class="fas text-xs"
                [class.fa-dollar-sign]="project.category === 'commercial'"
                [class.fa-book]="project.category === 'study'"
              ></i>
              {{
                (project.category === 'commercial'
                  ? 'projects.commercial.badge'
                  : 'projects.study.badge'
                ) | translate
              }}
            </div>
          </div>

          <!-- Sem esta marca, arte conceitual na capa passa por captura do
               sistema do cliente. Ver o campo illustrated no catálogo. -->
          <div
            *ngIf="project.illustrated && project.cover"
            class="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm"
          >
            {{ 'projects.illustrated.badge' | translate }}
          </div>

          <div
            class="project-buttons absolute bottom-3 right-3 translate-y-2 transform opacity-0 transition-all duration-300"
          >
            <div class="flex gap-2">
              <button
                *ngIf="project.demoUrl"
                data-card-control
                class="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-800 transition-all duration-200 hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                (click)="openUrl(project.demoUrl!)"
                [title]="'projects.viewDemo' | translate"
                [attr.aria-label]="
                  ('projects.viewDemo' | translate) + ': ' + (project.titleKey | translate)
                "
              >
                <i aria-hidden="true" class="fas fa-external-link-alt text-xs"></i>
              </button>
              <button
                *ngIf="project.githubUrl"
                data-card-control
                class="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-800 transition-all duration-200 hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                (click)="openUrl(project.githubUrl!)"
                [title]="'projects.viewCode' | translate"
                [attr.aria-label]="
                  ('projects.viewCode' | translate) + ': ' + (project.titleKey | translate)
                "
              >
                <i aria-hidden="true" class="fab fa-github text-xs"></i>
              </button>
              <button
                *ngIf="project.paperUrl"
                data-card-control
                class="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-800 transition-all duration-200 hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                (click)="openUrl(project.paperUrl!)"
                [title]="'projects.viewPaper' | translate"
                [attr.aria-label]="
                  ('projects.viewPaper' | translate) + ': ' + (project.titleKey | translate)
                "
              >
                <i aria-hidden="true" class="fas fa-graduation-cap text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="p-4 md:p-6">
          <div class="mb-2 flex items-start justify-between gap-3">
            <h4
              class="project-title text-lg font-semibold text-neutral-900 transition-colors duration-200 dark:text-neutral-100 md:text-xl"
            >
              {{ project.titleKey | translate }}
            </h4>
            <button
              type="button"
              data-card-control
              data-card-details
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-primary-700 transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
              (click)="openProjectModal(project)"
              [title]="'projects.viewDetails' | translate"
              [attr.aria-label]="
                ('projects.viewDetails' | translate) + ': ' + (project.titleKey | translate)
              "
            >
              <i aria-hidden="true" class="fas fa-eye text-sm"></i>
            </button>
          </div>
          <p class="line-clamp-3 mb-4 text-sm text-neutral-600 dark:text-neutral-300 md:text-base">
            {{ project.descriptionKey | translate }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              *ngFor="let tech of project.visibleTechnologies"
              class="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700 transition-colors duration-200 hover:bg-primary-100 hover:text-primary-800 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
            >
              {{ tech }}
            </span>
            <span
              *ngIf="project.hiddenTechnologies"
              class="rounded-md bg-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-600 dark:text-neutral-400"
            >
              +{{ project.hiddenTechnologies }}
            </span>
          </div>
        </div>
      </div>
    </ng-template>

    <section
      id="projects"
      class="projects relative overflow-hidden bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 px-3 py-8 dark:from-secondary-950 dark:via-primary-950 dark:to-accent-950 md:px-8 md:py-12 lg:px-16"
      aria-labelledby="projects-title"
    >
      <!-- Background Pattern -->
      <div
        class='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-30'
      ></div>

      <div class="relative z-10">
        <div class="container mx-auto">
          <!-- Header -->
          <div class="mb-8 text-center md:mb-12">
            <h2
              id="projects-title"
              class="section-title mb-4 text-3xl font-bold text-neutral-800 dark:text-neutral-100 md:text-4xl lg:text-5xl"
            >
              <span class="font-display text-secondary-600 dark:text-secondary-400">✦</span>
              {{ 'projects.title' | translate }}
            </h2>
            <p
              class="mx-auto max-w-2xl text-sm text-neutral-600 dark:text-neutral-300 md:text-base"
            >
              {{ 'projects.featured.subtitle' | translate }}
            </p>
            <p class="mt-2 text-xs text-neutral-500 dark:text-neutral-400 md:text-sm">
              {{ 'projects.clickInfo' | translate }}
            </p>
          </div>

          <!-- Cases em destaque: a primeira leitura precisa de poucas provas
               fortes, não do inventário inteiro. -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div
              *ngFor="let project of featuredProjects; trackBy: trackByProject"
              class="project-card cursor-pointer"
              [attr.data-project-card]="project.id"
            >
              <ng-container
                *ngTemplateOutlet="projectCard; context: { $implicit: project }"
              ></ng-container>
            </div>
          </div>

          <!-- Ver todos -->
          <div class="mt-8 flex justify-center md:mt-12">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-primary-300 px-5 py-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-600 dark:text-primary-200 dark:hover:bg-primary-900/30"
              (click)="toggleAllProjects()"
              [attr.aria-expanded]="showAllProjects"
              aria-controls="projects-inventory"
            >
              <i
                aria-hidden="true"
                class="fas"
                [class.fa-chevron-down]="!showAllProjects"
                [class.fa-chevron-up]="showAllProjects"
              ></i>
              {{
                showAllProjects
                  ? ('projects.all.hide' | translate)
                  : ('projects.all.show' | translate: totalParams)
              }}
            </button>
          </div>

          <div id="projects-inventory" *ngIf="showAllProjects" class="mt-10 md:mt-14">
            <!-- Commercial Projects Section -->
            <div class="mb-12 md:mb-16">
              <div class="mb-6 flex items-center justify-between md:mb-8">
                <h3
                  class="flex items-center gap-3 text-xl font-semibold text-neutral-800 dark:text-neutral-100 md:text-2xl"
                >
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 md:h-10 md:w-10"
                  >
                    <i
                      aria-hidden="true"
                      class="fas fa-briefcase text-sm text-white md:text-base"
                    ></i>
                  </div>
                  {{ 'projects.commercial.title' | translate }}
                </h3>
                <span class="text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
                  {{ commercialProjects.length }} {{ 'projects.projectsCount' | translate }}
                </span>
              </div>

              <div class="group relative">
                <button
                  *ngIf="canScrollLeft('commercial')"
                  (click)="scrollCarousel('commercial', 'left')"
                  [attr.aria-label]="'projects.carousel.previous' | translate"
                  class="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:scale-110 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                >
                  <i aria-hidden="true" class="fas fa-chevron-left"></i>
                </button>

                <button
                  *ngIf="canScrollRight('commercial')"
                  (click)="scrollCarousel('commercial', 'right')"
                  [attr.aria-label]="'projects.carousel.next' | translate"
                  class="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:scale-110 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                >
                  <i aria-hidden="true" class="fas fa-chevron-right"></i>
                </button>

                <div
                  #commercialCarousel
                  class="scrollbar-hide snap-x snap-mandatory scroll-smooth overflow-x-auto"
                  (scroll)="onScroll('commercial')"
                >
                  <div class="flex w-max min-w-full gap-4 pb-4">
                    <div
                      *ngFor="let project of commercialProjects; trackBy: trackByProject"
                      class="project-card shrink-0 cursor-pointer snap-start"
                      [attr.data-project-card]="project.id"
                    >
                      <ng-container
                        *ngTemplateOutlet="projectCard; context: { $implicit: project }"
                      ></ng-container>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Study Projects Section -->
            <div class="mb-8">
              <div class="mb-6 flex items-center justify-between md:mb-8">
                <h3
                  class="flex items-center gap-3 text-xl font-semibold text-neutral-800 dark:text-neutral-100 md:text-2xl"
                >
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 md:h-10 md:w-10"
                  >
                    <i
                      aria-hidden="true"
                      class="fas fa-graduation-cap text-sm text-white md:text-base"
                    ></i>
                  </div>
                  {{ 'projects.study.title' | translate }}
                </h3>
                <span class="text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
                  {{ studyProjects.length }} {{ 'projects.projectsCount' | translate }}
                </span>
              </div>

              <div class="group relative">
                <button
                  *ngIf="canScrollLeft('study')"
                  (click)="scrollCarousel('study', 'left')"
                  [attr.aria-label]="'projects.carousel.previous' | translate"
                  class="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:scale-110 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                >
                  <i aria-hidden="true" class="fas fa-chevron-left"></i>
                </button>

                <button
                  *ngIf="canScrollRight('study')"
                  (click)="scrollCarousel('study', 'right')"
                  [attr.aria-label]="'projects.carousel.next' | translate"
                  class="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:scale-110 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
                >
                  <i aria-hidden="true" class="fas fa-chevron-right"></i>
                </button>

                <div
                  #studyCarousel
                  class="scrollbar-hide snap-x snap-mandatory scroll-smooth overflow-x-auto"
                  (scroll)="onScroll('study')"
                >
                  <div class="flex w-max min-w-full gap-4 py-4">
                    <div
                      *ngFor="let project of studyProjects; trackBy: trackByProject"
                      class="project-card shrink-0 cursor-pointer snap-start"
                      [attr.data-project-card]="project.id"
                    >
                      <ng-container
                        *ngTemplateOutlet="projectCard; context: { $implicit: project }"
                      ></ng-container>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de detalhe -->
    <div
      *ngIf="selectedProject as project"
      class="project-modal fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="project.titleKey | translate"
    >
      <!-- Backdrop e um button de verdade: satisfaz teclado e foco sem o
             div-com-click que as regras de acessibilidade barram. -->
      <button
        type="button"
        tabindex="-1"
        class="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
        (click)="closeModal()"
        [attr.aria-label]="'projects.modal.close' | translate"
      ></button>

      <div
        #modalPanel
        class="project-modal-panel relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-primary-800 md:max-h-[90vh]"
      >
        <button
          #modalClose
          type="button"
          class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-primary-400"
          (click)="closeModal()"
          [attr.aria-label]="'projects.modal.close' | translate"
        >
          <i aria-hidden="true" class="fas fa-times"></i>
        </button>

        <div class="overflow-y-auto">
          <!-- Galeria -->
          <div
            class="project-modal-media relative flex w-full items-center justify-center overflow-hidden bg-neutral-900"
          >
            <picture *ngIf="project.gallery.length; else modalFallback">
              <source
                type="image/avif"
                [srcset]="project.gallery[slideIndex].avif"
                [attr.sizes]="modalSizes"
              />
              <source
                type="image/webp"
                [srcset]="project.gallery[slideIndex].webp"
                [attr.sizes]="modalSizes"
              />
              <img
                [src]="project.gallery[slideIndex].src"
                [alt]="imageAlt(project) + ' — ' + (slideIndex + 1)"
                [width]="project.gallery[slideIndex].width"
                [height]="project.gallery[slideIndex].height"
                class="block h-auto w-auto max-w-full shrink-0"
                decoding="async"
              />
            </picture>
            <ng-template #modalFallback>
              <span
                class="font-heading text-6xl font-bold tracking-widest text-white/80"
                aria-hidden="true"
              >
                {{ initials(project) }}
              </span>
            </ng-template>

            <div
              *ngIf="project.illustrated && project.gallery.length"
              class="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
            >
              {{ 'projects.illustrated.note' | translate }}
            </div>

            <ng-container *ngIf="project.gallery.length > 1">
              <button
                type="button"
                class="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-primary-400"
                (click)="prevSlide(project)"
                [attr.aria-label]="'projects.modal.previous' | translate"
              >
                <i aria-hidden="true" class="fas fa-chevron-left"></i>
              </button>
              <button
                type="button"
                class="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-primary-400"
                (click)="nextSlide(project)"
                [attr.aria-label]="'projects.modal.next' | translate"
              >
                <i aria-hidden="true" class="fas fa-chevron-right"></i>
              </button>
              <div class="absolute bottom-3 flex gap-2">
                <button
                  *ngFor="let slide of project.gallery; let i = index"
                  type="button"
                  class="h-2.5 w-2.5 rounded-full bg-white transition-opacity focus:outline-none focus:ring-2 focus:ring-primary-400"
                  [class.opacity-100]="i === slideIndex"
                  [class.opacity-40]="i !== slideIndex"
                  (click)="goToSlide(i)"
                  [attr.aria-label]="('projects.modal.goToImage' | translate) + ' ' + (i + 1)"
                  [attr.aria-current]="i === slideIndex"
                ></button>
              </div>
            </ng-container>
          </div>

          <!-- Detalhe -->
          <div class="p-5 md:p-8">
            <div class="mb-3 flex flex-wrap items-center gap-3">
              <span
                class="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white"
                [class.bg-primary-500]="project.category === 'commercial'"
                [class.bg-secondary-500]="project.category === 'study'"
              >
                <i
                  aria-hidden="true"
                  class="fas text-xs"
                  [class.fa-dollar-sign]="project.category === 'commercial'"
                  [class.fa-graduation-cap]="project.category === 'study'"
                ></i>
                {{
                  (project.category === 'commercial'
                    ? 'projects.commercial.badge'
                    : 'projects.study.badge'
                  ) | translate
                }}
              </span>
              <span
                *ngIf="project.gallery.length > 1"
                class="text-xs text-neutral-500 dark:text-neutral-400"
              >
                {{ slideIndex + 1 }} / {{ project.gallery.length }}
              </span>
            </div>

            <h3
              class="mb-4 font-heading text-2xl font-bold text-neutral-900 dark:text-neutral-100 md:text-3xl"
            >
              {{ project.titleKey | translate }}
            </h3>

            <p class="mb-6 leading-relaxed text-neutral-600 dark:text-neutral-300">
              {{ project.descriptionKey | translate }}
            </p>

            <!-- Fica fora do toggle de propósito: é a frase que responde "o que
                 esse trabalho prova", e o recrutador lê isso antes de decidir se
                 abre o detalhe. -->
            <ng-container *ngIf="project.decision as decision">
              <p
                data-decision-proves
                class="mb-6 flex gap-3 rounded-xl border-l-4 border-primary-400 bg-primary-50/70 p-4 text-sm leading-relaxed text-neutral-700 dark:border-primary-500 dark:bg-primary-900/20 dark:text-neutral-200"
              >
                <i aria-hidden="true" class="fas fa-lightbulb mt-0.5 text-primary-500"></i>
                <span>{{ decision.provesKey | translate }}</span>
              </p>

              <button
                *ngIf="hasDecisionDetails(project)"
                type="button"
                data-decision-toggle
                class="mb-6 inline-flex items-center gap-2 rounded-lg border border-primary-300 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-600 dark:text-primary-200 dark:hover:bg-primary-900/30"
                (click)="toggleDecisionDetails()"
                [attr.aria-expanded]="decisionExpanded"
                aria-controls="decision-details"
              >
                <i aria-hidden="true" class="fas fa-diagram-project"></i>
                {{ 'projects.modal.decision.action' | translate }}
              </button>

              <section
                *ngIf="hasDecisionDetails(project) && decisionExpanded"
                id="decision-details"
                class="mb-6 rounded-xl border border-primary-100 bg-primary-50/60 p-4 dark:border-primary-700 dark:bg-primary-900/20"
                [attr.aria-label]="'projects.modal.decision.title' | translate"
              >
                <h4 class="mb-4 font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ 'projects.modal.decision.title' | translate }}
                </h4>
                <dl class="space-y-4 text-sm leading-relaxed">
                  <div *ngIf="decision.contextKey">
                    <dt class="font-medium text-primary-700 dark:text-primary-300">
                      {{ 'projects.modal.decision.context' | translate }}
                    </dt>
                    <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                      {{ decision.contextKey | translate }}
                    </dd>
                  </div>
                  <div *ngIf="decision.constraintKey">
                    <dt class="font-medium text-primary-700 dark:text-primary-300">
                      {{ 'projects.modal.decision.constraint' | translate }}
                    </dt>
                    <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                      {{ decision.constraintKey | translate }}
                    </dd>
                  </div>
                  <div *ngIf="decision.decisionKey">
                    <dt class="font-medium text-primary-700 dark:text-primary-300">
                      {{ 'projects.modal.decision.decision' | translate }}
                    </dt>
                    <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                      {{ decision.decisionKey | translate }}
                    </dd>
                    <dd
                      class="mt-2 flex flex-wrap gap-1.5"
                      [attr.aria-label]="'projects.modal.stack' | translate"
                    >
                      <span
                        *ngFor="let tech of project.technologies"
                        class="rounded bg-white px-2 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:bg-primary-800 dark:text-neutral-200"
                      >
                        {{ tech }}
                      </span>
                    </dd>
                  </div>
                  <div *ngIf="decision.evidenceKey">
                    <dt class="font-medium text-primary-700 dark:text-primary-300">
                      {{ 'projects.modal.decision.evidence' | translate }}
                    </dt>
                    <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                      {{ decision.evidenceKey | translate }}
                    </dd>
                  </div>
                  <div *ngIf="decision.impactKey">
                    <dt class="font-medium text-primary-700 dark:text-primary-300">
                      {{ 'projects.modal.decision.impact' | translate }}
                    </dt>
                    <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                      {{ decision.impactKey | translate }}
                    </dd>
                  </div>
                </dl>

                <!-- Numero sem medicao anexada e dito como tal. A alternativa
                   honesta seria nao publicar; publicar sem a marca, nao. -->
                <p
                  *ngIf="decision.selfReported"
                  data-decision-self-reported
                  class="mt-4 flex gap-2 border-t border-primary-200 pt-3 text-xs text-neutral-500 dark:border-primary-700 dark:text-neutral-400"
                >
                  <i aria-hidden="true" class="fas fa-circle-info mt-0.5"></i>
                  <span>{{ 'projects.modal.decision.selfReported' | translate }}</span>
                </p>
              </section>
            </ng-container>

            <div class="mb-6">
              <h4
                class="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
              >
                {{ 'projects.modal.stack' | translate }}
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let tech of project.technologies"
                  class="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <div class="mb-6">
              <h4
                class="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
              >
                {{ 'projects.modal.tags' | translate }}
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  *ngFor="let tagKey of project.tagsKeys"
                  class="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                >
                  {{ tagKey | translate }}
                </span>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                *ngIf="project.demoUrl"
                type="button"
                data-modal-action="redirect"
                class="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400"
                (click)="openUrl(project.demoUrl!)"
              >
                <i aria-hidden="true" class="fas fa-external-link-alt text-xs"></i>
                {{ 'projects.redirect' | translate }}
              </button>
              <button
                *ngIf="project.githubUrl"
                type="button"
                data-modal-action="github"
                class="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
                (click)="openUrl(project.githubUrl!)"
              >
                <i aria-hidden="true" class="fab fa-github text-xs"></i>
                {{ 'projects.viewCode' | translate }}
              </button>
              <button
                *ngIf="project.paperUrl"
                type="button"
                data-modal-action="paper"
                class="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
                (click)="openUrl(project.paperUrl!)"
              >
                <i aria-hidden="true" class="fas fa-graduation-cap text-xs"></i>
                {{ 'projects.viewPaper' | translate }}
              </button>
              <span
                *ngIf="!project.demoUrl && !project.githubUrl && !project.paperUrl"
                class="text-sm italic text-neutral-500 dark:text-neutral-400"
              >
                {{ 'projects.modal.noLinks' | translate }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* Hide scrollbar but keep functionality */
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      .scroll-smooth {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      /* A largura do cartão é a mesma que o passo do carrossel mede; qualquer
         divergência entre as duas reabre a cauda vazia da auditoria. */
      .project-card {
        width: 100%;
      }

      #projects-inventory .project-card {
        width: 280px;
      }

      @media (min-width: 768px) {
        #projects-inventory .project-card {
          width: 384px;
        }
      }

      @media (max-width: 768px) {
        .project-card {
          touch-action: manipulation;
        }
      }

      .project-card:hover .project-image,
      .project-card:focus-within .project-image {
        transform: scale(1.05);
      }

      .project-card:hover .project-overlay,
      .project-card:focus-within .project-overlay {
        opacity: 1;
      }

      .project-card:hover .project-buttons,
      .project-card:focus-within .project-buttons {
        opacity: 1;
        transform: translateY(0);
      }

      .project-card:focus-within .project-card-inner {
        box-shadow: 0 0 0 2px rgb(99 102 241);
      }

      /* Modal */
      @keyframes modalIn {
        from {
          opacity: 0;
          transform: translateY(12px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .project-modal-panel {
        animation: modalIn 0.2s ease-out;
      }

      @media (prefers-reduced-motion: reduce) {
        .project-modal-panel {
          animation: none;
        }

        .project-card:hover .project-image,
        .project-card:focus-within .project-image {
          transform: none;
        }
      }
    `
  ]
})
export class ProjectsComponent {
  @ViewChild('commercialCarousel') commercialCarousel?: ElementRef<HTMLDivElement>;
  @ViewChild('studyCarousel') studyCarousel?: ElementRef<HTMLDivElement>;
  @ViewChild('modalClose') modalClose?: ElementRef<HTMLButtonElement>;
  @ViewChild('modalPanel') modalPanel?: ElementRef<HTMLElement>;

  public selectedProject: ProjectItem | null = null;
  public slideIndex = 0;
  public decisionExpanded = false;
  public showAllProjects = false;
  private lastFocusedElement: HTMLElement | null = null;

  private cdr = inject(ChangeDetectorRef);
  private commands = inject(PortfolioCommandService);
  private destroyRef = inject(DestroyRef);
  private host = inject(ElementRef<HTMLElement>);
  private catalog = inject(ProjectCatalogService);
  private translate = inject(TranslateService);
  private scrollLock = inject(ScrollLockService);

  public commercialProjects: ProjectItem[] = this.catalog.commercial;
  public studyProjects: ProjectItem[] = this.catalog.study;
  public featuredProjects: ProjectItem[] = this.catalog.featured;
  public readonly totalParams = { count: this.catalog.all.length };

  // `sizes` casa com a largura real do cartão em cada breakpoint; sem isso o
  // navegador assume 100vw e baixa a maior derivada em qualquer tela.
  public readonly cardSizes = '(max-width: 767px) 280px, (max-width: 1279px) 384px, 400px';
  public readonly modalSizes = '(max-width: 768px) 100vw, 960px';

  // Iniciais dependem do idioma; recalcular a cada ciclo de detecção custaria
  // um translate.instant por cartão sem imagem.
  private initialsCache = new Map<string, string>();

  // Scroll state tracking
  public scrollStates = {
    commercial: { canScrollLeft: false, canScrollRight: true },
    study: { canScrollLeft: false, canScrollRight: true }
  };

  constructor() {
    this.destroyRef.onDestroy(() => this.scrollLock.unlock('project-modal'));
    this.commands.openProject$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((project) => {
      // Comando de terminal ou quick open pode apontar para card que só existe
      // no inventário; abrir o modal sem revelar a lista deixaria o retorno de
      // foco apontando para um elemento que não está na página.
      this.showAllProjects = true;
      this.openProjectModal(project);
    });
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.initialsCache.clear());
  }

  // TrackBy function for performance
  trackByProject(index: number, project: ProjectItem): string {
    return project.id;
  }

  toggleAllProjects(): void {
    this.showAllProjects = !this.showAllProjects;
    this.cdr.markForCheck();
    if (!this.showAllProjects) return;
    // As setas dependem de medida real; sem esperar o render, ambos os
    // carrosséis nasceriam achando que não há para onde rolar.
    setTimeout(() => {
      this.onScroll('commercial');
      this.onScroll('study');
    });
  }

  // Scroll carousel left or right
  scrollCarousel(category: 'commercial' | 'study', direction: 'left' | 'right'): void {
    const carousel = category === 'commercial' ? this.commercialCarousel : this.studyCarousel;
    if (!carousel) return;

    const firstCard = carousel.nativeElement.querySelector<HTMLElement>('[data-project-card]');
    const cardWidth =
      firstCard?.getBoundingClientRect().width ?? carousel.nativeElement.clientWidth;
    const railStyles = getComputedStyle(carousel.nativeElement.firstElementChild as HTMLElement);
    const gap =
      [railStyles.columnGap, railStyles.gap]
        .map((value) => Number.parseFloat(value))
        .find(Number.isFinite) ?? 0;
    const scrollAmount = cardWidth + gap;
    const currentScroll = carousel.nativeElement.scrollLeft;
    const targetScroll =
      direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

    carousel.nativeElement.scrollTo({
      left: targetScroll,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }

  // Check if can scroll left
  canScrollLeft(category: 'commercial' | 'study'): boolean {
    return this.scrollStates[category].canScrollLeft;
  }

  // Check if can scroll right
  canScrollRight(category: 'commercial' | 'study'): boolean {
    return this.scrollStates[category].canScrollRight;
  }

  // Handle scroll event to update navigation buttons
  onScroll(category: 'commercial' | 'study'): void {
    const carousel = category === 'commercial' ? this.commercialCarousel : this.studyCarousel;
    if (!carousel) return;

    const element = carousel.nativeElement;
    const canScrollLeft = element.scrollLeft > 0;
    const canScrollRight = element.scrollLeft < element.scrollWidth - element.clientWidth - 10;

    this.scrollStates[category] = { canScrollLeft, canScrollRight };
    this.cdr.markForCheck();
  }

  /**
   * O botão de detalhe só existe quando há detalhe. Projeto pequeno entra com a
   * frase de prova e mais nada, e um toggle que abre um bloco vazio é pior que
   * a ausência do toggle.
   */
  hasDecisionDetails(project: ProjectItem): boolean {
    const decision = project.decision;
    if (!decision) return false;
    return Boolean(
      decision.contextKey ||
      decision.constraintKey ||
      decision.decisionKey ||
      decision.evidenceKey ||
      decision.impactKey
    );
  }

  /**
   * Alt da capa e dos slides. Quando a imagem é ilustração conceitual, o texto
   * alternativo precisa dizer isso: o selo visual não alcança leitor de tela, e
   * anunciar arte gerada como se fosse a tela do sistema é afirmação falsa.
   */
  imageAlt(project: ProjectItem): string {
    const title = this.translate.instant(project.titleKey);
    if (!project.illustrated) return title;
    return `${title} — ${this.translate.instant('projects.illustrated.alt')}`;
  }

  // Iniciais do titulo traduzido, para o card sem screenshot.
  initials(project: ProjectItem): string {
    const cached = this.initialsCache.get(project.id);
    if (cached !== undefined) return cached;

    const words = this.translate
      .instant(project.titleKey)
      .split(/[\s+/]+/)
      .filter((word: string) => /[a-zA-Z0-9]/.test(word));

    // Titulo de uma palavra so renderiza duas letras; duas ou mais, uma de cada.
    const value =
      words.length === 1
        ? words[0].slice(0, 2).toUpperCase()
        : words
            .slice(0, 2)
            .map((word: string) => word[0].toUpperCase())
            .join('');

    this.initialsCache.set(project.id, value);
    return value;
  }

  /** Mantém o clique no card como atalho de mouse sem transformar um contêiner
   * em botão e sem aninhar os controles de link dentro dele. */
  @HostListener('click', ['$event'])
  onProjectsClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element) || target.closest('[data-card-control]')) return;

    const card = target.closest<HTMLElement>('[data-project-card]');
    const projectId = card?.dataset['projectCard'];
    if (!projectId) return;

    const project = this.catalog.find(projectId);
    if (project) this.openProjectModal(project);
  }

  openProjectModal(project: ProjectItem): void {
    if (this.selectedProject) return;
    this.lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.selectedProject = project;
    this.slideIndex = 0;
    this.decisionExpanded = false;
    // Sem isso a pagina atras do modal rola junto no scroll do overlay.
    this.scrollLock.lock('project-modal');
    this.setBackgroundInert(true);
    this.cdr.markForCheck();
    // Foco no botao de fechar para o teclado nao continuar preso no card.
    setTimeout(() => this.modalClose?.nativeElement.focus());
  }

  closeModal(): void {
    this.selectedProject = null;
    this.decisionExpanded = false;
    this.scrollLock.unlock('project-modal');
    this.setBackgroundInert(false);
    this.cdr.markForCheck();
    setTimeout(() => {
      if (this.lastFocusedElement?.isConnected) this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    });
  }

  nextSlide(project: ProjectItem): void {
    const total = project.gallery.length;
    if (total > 1) {
      this.slideIndex = (this.slideIndex + 1) % total;
      this.cdr.markForCheck();
    }
  }

  prevSlide(project: ProjectItem): void {
    const total = project.gallery.length;
    if (total > 1) {
      this.slideIndex = (this.slideIndex - 1 + total) % total;
      this.cdr.markForCheck();
    }
  }

  goToSlide(index: number): void {
    this.slideIndex = index;
    this.cdr.markForCheck();
  }

  toggleDecisionDetails(): void {
    this.decisionExpanded = !this.decisionExpanded;
    this.cdr.markForCheck();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const project = this.selectedProject;
    if (!project) return;

    if (event.key === 'Tab') {
      this.trapFocus(event);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closeModal();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide(project);
    } else if (event.key === 'ArrowLeft') {
      this.prevSlide(project);
    }
  }

  // Open URL in new tab
  openUrl(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.modalPanel?.nativeElement;
    if (!panel) return;
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
    ).filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable.at(-1)!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private setBackgroundInert(inert: boolean): void {
    const background = [
      ...document.querySelectorAll('app-header, app-command-center, main > :not(app-projects)'),
      this.host.nativeElement.querySelector('section')
    ].filter((element): element is HTMLElement => element instanceof HTMLElement);

    background.forEach((element) => {
      if (inert) element.setAttribute('inert', '');
      else element.removeAttribute('inert');
    });
  }
}
