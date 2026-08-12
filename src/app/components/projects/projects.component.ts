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
    <section
      id="projects"
      class="projects py-8 md:py-12 px-3 md:px-8 lg:px-16 bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 dark:from-secondary-950 dark:via-primary-950 dark:to-accent-950 relative overflow-hidden"
      aria-labelledby="projects-title"
    >
      <!-- Background Pattern -->
      <div
        class='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-30'
      ></div>

      <!-- Animated background gradient -->
      <div
        class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-secondary-100/20 via-transparent to-primary-100/20 dark:from-secondary-800/20 dark:to-primary-800/20 animate-pulse-slow"
      ></div>

      <div class="relative z-10">
        <div class="container mx-auto">
          <!-- Header -->
          <div class="text-center mb-8 md:mb-12">
            <h2
              id="projects-title"
              class="section-title text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-4"
            >
              <span class="font-display text-secondary-600 dark:text-secondary-400">✦</span>
              {{ 'projects.title' | translate }}
            </h2>
            <p
              class="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto"
            >
              {{ 'projects.subtitle' | translate }}
            </p>
            <p class="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              {{ 'projects.clickInfo' | translate }}
            </p>
          </div>

          <!-- Commercial Projects Section -->
          <div class="mb-12 md:mb-16">
            <div class="flex items-center justify-between mb-6 md:mb-8">
              <h3
                class="text-xl md:text-2xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-3"
              >
                <div
                  class="w-8 h-8 md:w-10 md:h-10 bg-primary-500 rounded-lg flex items-center justify-center"
                >
                  <i
                    aria-hidden="true"
                    class="fas fa-briefcase text-white text-sm md:text-base"
                  ></i>
                </div>
                {{ 'projects.commercial.title' | translate }}
              </h3>
              <span class="text-sm md:text-base text-neutral-500 dark:text-neutral-400">
                {{ commercialProjects.length }} {{ 'projects.projectsCount' | translate }}
              </span>
            </div>

            <!-- Commercial Projects Carousel -->
            <div class="relative group">
              <!-- Navigation Arrows -->
              <button
                *ngIf="canScrollLeft('commercial')"
                (click)="scrollCarousel('commercial', 'left')"
                (keyup.enter)="scrollCarousel('commercial', 'left')"
                (keyup.space)="scrollCarousel('commercial', 'left')"
                [attr.aria-label]="'Previous projects'"
                tabindex="0"
                class="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:scale-110 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
              >
                <i aria-hidden="true" class="fas fa-chevron-left"></i>
              </button>

              <button
                *ngIf="canScrollRight('commercial')"
                (click)="scrollCarousel('commercial', 'right')"
                (keyup.enter)="scrollCarousel('commercial', 'right')"
                (keyup.space)="scrollCarousel('commercial', 'right')"
                [attr.aria-label]="'Next projects'"
                tabindex="0"
                class="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:scale-110 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
              >
                <i aria-hidden="true" class="fas fa-chevron-right"></i>
              </button>

              <!-- Carousel Container -->
              <div
                #commercialCarousel
                class="scrollbar-hide scroll-smooth overflow-x-auto snap-x snap-mandatory"
                (scroll)="onScroll('commercial')"
              >
                <div class="flex min-w-full w-max gap-4 pb-4">
                  <div
                    *ngFor="
                      let project of commercialProjects;
                      trackBy: trackByProject;
                      let i = index
                    "
                    class="project-card w-80 shrink-0 snap-start cursor-pointer md:w-96"
                    [style.animation-delay]="getStaggerDelay(i)"
                    [attr.data-project-card]="project.id"
                  >
                    <div
                      class="project-card-inner bg-white dark:bg-primary-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer h-full group focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <div class="relative overflow-hidden">
                        <img
                          *ngIf="project.image"
                          [src]="project.image"
                          [alt]="project.titleKey | translate"
                          class="project-image w-full h-48 md:h-56 object-cover transition-transform duration-500"
                          loading="lazy"
                        />
                        <div
                          *ngIf="!project.image"
                          class="project-image w-full h-48 md:h-56 flex items-center justify-center bg-gradient-primary transition-transform duration-500"
                          aria-hidden="true"
                        >
                          <span
                            class="font-heading text-5xl font-bold text-white/90 tracking-widest"
                          >
                            {{ initials(project) }}
                          </span>
                        </div>
                        <div
                          class="project-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300"
                        ></div>
                        <div class="absolute top-3 left-3">
                          <div
                            class="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg"
                          >
                            <i aria-hidden="true" class="fas fa-dollar-sign text-xs"></i>
                            {{ 'projects.commercial.badge' | translate }}
                          </div>
                        </div>
                        <div
                          class="project-buttons absolute bottom-3 right-3 opacity-0 transition-all duration-300 transform translate-y-2"
                        >
                          <div class="flex gap-2">
                            <button
                              *ngIf="project.demoUrl"
                              class="w-8 h-8 bg-white/90 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              (click)="$event.stopPropagation(); openUrl(project.demoUrl!)"
                              (keyup.enter)="$event.stopPropagation(); openUrl(project.demoUrl!)"
                              (keyup.space)="$event.stopPropagation(); openUrl(project.demoUrl!)"
                              [title]="'projects.viewDemo' | translate"
                              [attr.aria-label]="'View demo for ' + (project.titleKey | translate)"
                              tabindex="0"
                            >
                              <i aria-hidden="true" class="fas fa-external-link-alt text-xs"></i>
                            </button>
                            <button
                              *ngIf="project.githubUrl"
                              class="w-8 h-8 bg-white/90 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              (click)="$event.stopPropagation(); openUrl(project.githubUrl!)"
                              (keyup.enter)="$event.stopPropagation(); openUrl(project.githubUrl!)"
                              (keyup.space)="$event.stopPropagation(); openUrl(project.githubUrl!)"
                              [title]="'projects.viewCode' | translate"
                              [attr.aria-label]="'View code for ' + (project.titleKey | translate)"
                              tabindex="0"
                            >
                              <i aria-hidden="true" class="fab fa-github text-xs"></i>
                            </button>
                            <button
                              *ngIf="project.paperUrl"
                              class="w-8 h-8 bg-white/90 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              (click)="$event.stopPropagation(); openUrl(project.paperUrl!)"
                              (keyup.enter)="$event.stopPropagation(); openUrl(project.paperUrl!)"
                              (keyup.space)="$event.stopPropagation(); openUrl(project.paperUrl!)"
                              [title]="'projects.viewPaper' | translate"
                              [attr.aria-label]="
                                'View publication for ' + (project.titleKey | translate)
                              "
                              tabindex="0"
                            >
                              <i aria-hidden="true" class="fas fa-graduation-cap text-xs"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="p-4 md:p-6">
                        <div class="mb-2 flex items-start justify-between gap-3">
                          <h4
                            class="project-title text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 transition-colors duration-200"
                          >
                            {{ project.titleKey | translate }}
                          </h4>
                          <button
                            type="button"
                            data-card-control
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-primary-700 transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                            (click)="openProjectModal(project)"
                            [title]="'projects.viewDetails' | translate"
                            [attr.aria-label]="
                              ('projects.viewDetails' | translate) +
                              ': ' +
                              (project.titleKey | translate)
                            "
                          >
                            <i aria-hidden="true" class="fas fa-eye text-sm"></i>
                          </button>
                        </div>
                        <p
                          class="text-sm md:text-base text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3"
                        >
                          {{ project.descriptionKey | translate }}
                        </p>
                        <div class="flex flex-wrap gap-2">
                          <span
                            *ngFor="let tech of project.technologies.slice(0, 4)"
                            class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs rounded-md font-medium transition-colors duration-200 hover:bg-primary-100 hover:text-primary-800 dark:hover:bg-primary-900/30 dark:hover:text-primary-400"
                          >
                            {{ tech }}
                          </span>
                          <span
                            *ngIf="project.technologies.length > 4"
                            class="px-2 py-1 bg-neutral-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-400 text-xs rounded-md font-medium"
                          >
                            +{{ project.technologies.length - 4 }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Study Projects Section -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-6 md:mb-8">
              <h3
                class="text-xl md:text-2xl font-semibold text-neutral-800 dark:text-neutral-100 flex items-center gap-3"
              >
                <div
                  class="w-8 h-8 md:w-10 md:h-10 bg-primary-500 rounded-lg flex items-center justify-center"
                >
                  <i
                    aria-hidden="true"
                    class="fas fa-graduation-cap text-white text-sm md:text-base"
                  ></i>
                </div>
                {{ 'projects.study.title' | translate }}
              </h3>
              <span class="text-sm md:text-base text-neutral-500 dark:text-neutral-400">
                {{ studyProjects.length }} {{ 'projects.projectsCount' | translate }}
              </span>
            </div>

            <!-- Study Projects Carousel -->
            <div class="relative group">
              <!-- Navigation Arrows -->
              <button
                *ngIf="canScrollLeft('study')"
                (click)="scrollCarousel('study', 'left')"
                (keyup.enter)="scrollCarousel('study', 'left')"
                (keyup.space)="scrollCarousel('study', 'left')"
                [attr.aria-label]="'Previous projects'"
                tabindex="0"
                class="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:scale-110 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
              >
                <i aria-hidden="true" class="fas fa-chevron-left"></i>
              </button>

              <button
                *ngIf="canScrollRight('study')"
                (click)="scrollCarousel('study', 'right')"
                (keyup.enter)="scrollCarousel('study', 'right')"
                (keyup.space)="scrollCarousel('study', 'right')"
                [attr.aria-label]="'Next projects'"
                tabindex="0"
                class="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition-all duration-200 hover:scale-110 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
              >
                <i aria-hidden="true" class="fas fa-chevron-right"></i>
              </button>

              <!-- Carousel Container -->
              <div
                #studyCarousel
                class="scrollbar-hide scroll-smooth overflow-x-auto snap-x snap-mandatory"
                (scroll)="onScroll('study')"
              >
                <div class="flex min-w-full w-max gap-4 py-4">
                  <div
                    *ngFor="let project of studyProjects; trackBy: trackByProject; let i = index"
                    class="project-card w-80 shrink-0 snap-start cursor-pointer md:w-96"
                    [style.animation-delay]="getStaggerDelay(i)"
                    [attr.data-project-card]="project.id"
                  >
                    <div
                      class="project-card-inner bg-white dark:bg-primary-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer h-full group focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <div class="relative overflow-hidden">
                        <img
                          *ngIf="project.image"
                          [src]="project.image"
                          [alt]="project.titleKey | translate"
                          class="project-image w-full h-48 md:h-56 object-cover transition-transform duration-500"
                          loading="lazy"
                        />
                        <div
                          *ngIf="!project.image"
                          class="project-image w-full h-48 md:h-56 flex items-center justify-center bg-gradient-primary transition-transform duration-500"
                          aria-hidden="true"
                        >
                          <span
                            class="font-heading text-5xl font-bold text-white/90 tracking-widest"
                          >
                            {{ initials(project) }}
                          </span>
                        </div>
                        <div
                          class="project-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300"
                        ></div>
                        <div class="absolute top-3 left-3">
                          <div
                            class="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg"
                          >
                            <i aria-hidden="true" class="fas fa-book text-xs"></i>
                            {{ 'projects.study.badge' | translate }}
                          </div>
                        </div>
                        <div
                          class="project-buttons absolute bottom-3 right-3 opacity-0 transition-all duration-300 transform translate-y-2"
                        >
                          <div class="flex gap-2">
                            <button
                              *ngIf="project.demoUrl"
                              class="w-8 h-8 bg-white/90 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              (click)="$event.stopPropagation(); openUrl(project.demoUrl!)"
                              (keyup.enter)="$event.stopPropagation(); openUrl(project.demoUrl!)"
                              (keyup.space)="$event.stopPropagation(); openUrl(project.demoUrl!)"
                              [title]="'projects.viewDemo' | translate"
                              [attr.aria-label]="'View demo for ' + (project.titleKey | translate)"
                              tabindex="0"
                            >
                              <i aria-hidden="true" class="fas fa-external-link-alt text-xs"></i>
                            </button>
                            <button
                              *ngIf="project.githubUrl"
                              class="w-8 h-8 bg-white/90 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              (click)="$event.stopPropagation(); openUrl(project.githubUrl!)"
                              (keyup.enter)="$event.stopPropagation(); openUrl(project.githubUrl!)"
                              (keyup.space)="$event.stopPropagation(); openUrl(project.githubUrl!)"
                              [title]="'projects.viewCode' | translate"
                              [attr.aria-label]="'View code for ' + (project.titleKey | translate)"
                              tabindex="0"
                            >
                              <i aria-hidden="true" class="fab fa-github text-xs"></i>
                            </button>
                            <button
                              *ngIf="project.paperUrl"
                              class="w-8 h-8 bg-white/90 hover:bg-white text-neutral-800 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              (click)="$event.stopPropagation(); openUrl(project.paperUrl!)"
                              (keyup.enter)="$event.stopPropagation(); openUrl(project.paperUrl!)"
                              (keyup.space)="$event.stopPropagation(); openUrl(project.paperUrl!)"
                              [title]="'projects.viewPaper' | translate"
                              [attr.aria-label]="
                                'View publication for ' + (project.titleKey | translate)
                              "
                              tabindex="0"
                            >
                              <i aria-hidden="true" class="fas fa-graduation-cap text-xs"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="p-4 md:p-6">
                        <div class="mb-2 flex items-start justify-between gap-3">
                          <h4
                            class="project-title text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 transition-colors duration-200"
                          >
                            {{ project.titleKey | translate }}
                          </h4>
                          <button
                            type="button"
                            data-card-control
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary-200 bg-primary-50 text-primary-700 transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-700 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                            (click)="openProjectModal(project)"
                            [title]="'projects.viewDetails' | translate"
                            [attr.aria-label]="
                              ('projects.viewDetails' | translate) +
                              ': ' +
                              (project.titleKey | translate)
                            "
                          >
                            <i aria-hidden="true" class="fas fa-eye text-sm"></i>
                          </button>
                        </div>
                        <p
                          class="text-sm md:text-base text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3"
                        >
                          {{ project.descriptionKey | translate }}
                        </p>
                        <div class="flex flex-wrap gap-2">
                          <span
                            *ngFor="let tech of project.technologies.slice(0, 4)"
                            class="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs rounded-md font-medium transition-colors duration-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                          >
                            {{ tech }}
                          </span>
                          <span
                            *ngIf="project.technologies.length > 4"
                            class="px-2 py-1 bg-neutral-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-400 text-xs rounded-md font-medium"
                          >
                            +{{ project.technologies.length - 4 }}
                          </span>
                        </div>
                      </div>
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
            <img
              *ngIf="slides(project).length; else modalFallback"
              [src]="slides(project)[slideIndex]"
              [alt]="(project.titleKey | translate) + ' — ' + (slideIndex + 1)"
              class="block h-auto w-auto max-w-full shrink-0"
            />
            <ng-template #modalFallback>
              <span
                class="font-heading text-6xl font-bold tracking-widest text-white/80"
                aria-hidden="true"
              >
                {{ initials(project) }}
              </span>
            </ng-template>

            <ng-container *ngIf="slides(project).length > 1">
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
                  *ngFor="let slide of slides(project); let i = index"
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
                  class="text-xs fas"
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
                *ngIf="slides(project).length > 1"
                class="text-xs text-neutral-500 dark:text-neutral-400"
              >
                {{ slideIndex + 1 }} / {{ slides(project).length }}
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

            <button
              *ngIf="project.decision"
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
              *ngIf="project.decision && decisionExpanded"
              id="decision-details"
              class="mb-6 rounded-xl border border-primary-100 bg-primary-50/60 p-4 dark:border-primary-700 dark:bg-primary-900/20"
              [attr.aria-label]="'projects.modal.decision.title' | translate"
            >
              <h4 class="mb-4 font-semibold text-neutral-900 dark:text-neutral-100">
                {{ 'projects.modal.decision.title' | translate }}
              </h4>
              <dl class="space-y-4 text-sm leading-relaxed">
                <div>
                  <dt class="font-medium text-primary-700 dark:text-primary-300">
                    {{ 'projects.modal.decision.context' | translate }}
                  </dt>
                  <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                    {{ project.decision.contextKey | translate }}
                  </dd>
                </div>
                <div>
                  <dt class="font-medium text-primary-700 dark:text-primary-300">
                    {{ 'projects.modal.decision.constraint' | translate }}
                  </dt>
                  <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                    {{ project.decision.constraintKey | translate }}
                  </dd>
                </div>
                <div>
                  <dt class="font-medium text-primary-700 dark:text-primary-300">
                    {{ 'projects.modal.decision.decision' | translate }}
                  </dt>
                  <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                    {{ project.decision.decisionKey | translate }}
                  </dd>
                  <dd class="mt-2 flex flex-wrap gap-1.5" aria-label="Stack na decisão">
                    <span
                      *ngFor="let tech of project.technologies"
                      class="rounded bg-white px-2 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:bg-primary-800 dark:text-neutral-200"
                    >
                      {{ tech }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="font-medium text-primary-700 dark:text-primary-300">
                    {{ 'projects.modal.decision.evidence' | translate }}
                  </dt>
                  <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                    {{ project.decision.evidenceKey | translate }}
                  </dd>
                </div>
                <div>
                  <dt class="font-medium text-primary-700 dark:text-primary-300">
                    {{ 'projects.modal.decision.impact' | translate }}
                  </dt>
                  <dd class="mt-1 text-neutral-700 dark:text-neutral-200">
                    {{ project.decision.impactKey | translate }}
                  </dd>
                </div>
              </dl>
            </section>

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

      .project-card {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
      }

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

      /* Smooth scroll */
      .scroll-smooth {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      /* Touch optimization for mobile */
      @media (max-width: 768px) {
        .project-card {
          touch-action: manipulation;
        }
      }

      /* Hover effects */
      .group:hover .opacity-0 {
        opacity: 1;
      }

      /* Card hover animations - using valid CSS selectors */
      .project-card:hover .project-card-inner {
        transform: scale(1.02);
      }

      .project-card:hover .project-image {
        transform: scale(1.1);
      }

      .project-card:hover .project-overlay {
        opacity: 1;
      }

      .project-card:hover .project-buttons {
        opacity: 1;
        transform: translateY(0);
      }

      .project-card:hover .project-title {
        color: #4ade80; /* green-600 for commercial */
      }

      /* Button hover effects */
      button:hover {
        transform: scale(1.1);
      }

      /* Focus styles for better accessibility */
      .project-card:focus .project-card-inner {
        transform: scale(1.02);
        box-shadow: 0 0 0 2px #059669;
      }

      .project-card:focus .project-overlay {
        opacity: 1;
      }

      .project-card:focus .project-buttons {
        opacity: 1;
        transform: translateY(0);
      }

      /* Stagger animation delay */
      .project-card:nth-child(1) {
        animation-delay: 0s;
      }
      .project-card:nth-child(2) {
        animation-delay: 0.1s;
      }
      .project-card:nth-child(3) {
        animation-delay: 0.2s;
      }
      .project-card:nth-child(4) {
        animation-delay: 0.3s;
      }
      .project-card:nth-child(5) {
        animation-delay: 0.4s;
      }

      /* Navigation arrows positioning */
      .group:hover button {
        opacity: 1;
      }

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

      /* Responsive adjustments */
      @media (max-width: 640px) {
        .project-card {
          width: 280px;
        }
      }

      @media (min-width: 1024px) {
        .project-card {
          width: 400px;
        }
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

      /* O :hover global de button acima aplicaria scale(1.1) tambem nos
         controles do modal, que sao ancorados por posicao absoluta. */
      .project-modal button:hover {
        transform: none;
      }

      @media (prefers-reduced-motion: reduce) {
        .project-modal-panel {
          animation: none;
        }
      }
    `
  ]
})
export class ProjectsComponent {
  @ViewChild('commercialCarousel') commercialCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('studyCarousel') studyCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('modalClose') modalClose?: ElementRef<HTMLButtonElement>;
  @ViewChild('modalPanel') modalPanel?: ElementRef<HTMLElement>;

  public selectedProject: ProjectItem | null = null;
  public slideIndex = 0;
  public decisionExpanded = false;
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

  // Scroll state tracking
  public scrollStates = {
    commercial: { canScrollLeft: false, canScrollRight: true },
    study: { canScrollLeft: false, canScrollRight: true }
  };

  constructor() {
    this.destroyRef.onDestroy(() => this.scrollLock.unlock('project-modal'));
    this.commands.openProject$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((project) => {
      this.openProjectModal(project);
    });
  }

  // TrackBy function for performance
  trackByProject(index: number, project: ProjectItem): string {
    return project.id;
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

  // Iniciais do titulo traduzido, para o card sem screenshot.
  initials(project: ProjectItem): string {
    const words = this.translate
      .instant(project.titleKey)
      .split(/[\s+/]+/)
      .filter((word: string) => /[a-zA-Z0-9]/.test(word));

    // Titulo de uma palavra so renderiza duas letras; duas ou mais, uma de cada.
    return words.length === 1
      ? words[0].slice(0, 2).toUpperCase()
      : words
          .slice(0, 2)
          .map((word: string) => word[0].toUpperCase())
          .join('');
  }

  // Get stagger delay for animations
  getStaggerDelay(index: number): string {
    return `${index * 0.1}s`;
  }

  // Galeria do modal: `images` quando existe, senao a capa do card, senao nada.
  slides(project: ProjectItem): string[] {
    if (project.images?.length) return project.images;
    return project.image ? [project.image] : [];
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

    const project = [...this.commercialProjects, ...this.studyProjects].find(
      (item) => item.id === projectId
    );
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
    const total = this.slides(project).length;
    if (total > 1) {
      this.slideIndex = (this.slideIndex + 1) % total;
      this.cdr.markForCheck();
    }
  }

  prevSlide(project: ProjectItem): void {
    const total = this.slides(project).length;
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

  // Utility method to get translated tags (if needed)
  getTranslatedTags(tagsKeys: string[]): string[] {
    return tagsKeys.map((key) => this.translate.instant(key));
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
      ...document.querySelectorAll(
        'app-header, app-command-center, app-status-bar, main > :not(app-projects)'
      ),
      this.host.nativeElement.querySelector('section')
    ].filter((element): element is HTMLElement => element instanceof HTMLElement);

    background.forEach((element) => {
      if (inert) element.setAttribute('inert', '');
      else element.removeAttribute('inert');
    });
  }
}
