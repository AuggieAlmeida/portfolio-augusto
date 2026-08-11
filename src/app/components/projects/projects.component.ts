import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import projectsData from './projects.json';

interface ProjectItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  category: 'commercial' | 'study';
  tagsKeys: string[];
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  /** Publicação acadêmica do projeto — não é demo nem repositório, e rotular
   *  como um dos dois enganaria quem clica. */
  paperUrl?: string;
}

interface ProjectsData {
  commercial: ProjectItem[];
  study: ProjectItem[];
}

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
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:opacity-100"
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
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:opacity-100"
              >
                <i aria-hidden="true" class="fas fa-chevron-right"></i>
              </button>

              <!-- Carousel Container -->
              <div
                #commercialCarousel
                class="overflow-x-auto scrollbar-hide scroll-smooth"
                (scroll)="onScroll('commercial')"
              >
                <div
                  class="flex gap-4 pb-4"
                  [style.width.px]="getCarouselWidth(commercialProjects.length)"
                >
                  <div
                    *ngFor="
                      let project of commercialProjects;
                      trackBy: trackByProject;
                      let i = index
                    "
                    class="project-card flex-shrink-0 w-80 md:w-96"
                    [style.animation-delay]="getStaggerDelay(i)"
                    (click)="openProjectModal(project)"
                    (keyup.enter)="openProjectModal(project)"
                    (keyup.space)="openProjectModal(project)"
                    [attr.aria-label]="'Open project: ' + (project.titleKey | translate)"
                    tabindex="0"
                    role="button"
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
                        <h4
                          class="project-title text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 transition-colors duration-200"
                        >
                          {{ project.titleKey | translate }}
                        </h4>
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
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:opacity-100"
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
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:opacity-100"
              >
                <i aria-hidden="true" class="fas fa-chevron-right"></i>
              </button>

              <!-- Carousel Container -->
              <div
                #studyCarousel
                class="overflow-x-auto scrollbar-hide scroll-smooth"
                (scroll)="onScroll('study')"
              >
                <div
                  class="flex gap-4 py-4"
                  [style.width.px]="getCarouselWidth(studyProjects.length)"
                >
                  <div
                    *ngFor="let project of studyProjects; trackBy: trackByProject; let i = index"
                    class="project-card flex-shrink-0 w-80 md:w-96"
                    [style.animation-delay]="getStaggerDelay(i)"
                    (click)="openProjectModal(project)"
                    (keyup.enter)="openProjectModal(project)"
                    (keyup.space)="openProjectModal(project)"
                    [attr.aria-label]="'Open project: ' + (project.titleKey | translate)"
                    tabindex="0"
                    role="button"
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
                        <h4
                          class="project-title text-lg md:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 transition-colors duration-200"
                        >
                          {{ project.titleKey | translate }}
                        </h4>
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
    `
  ]
})
export class ProjectsComponent {
  @ViewChild('commercialCarousel') commercialCarousel!: ElementRef<HTMLDivElement>;
  @ViewChild('studyCarousel') studyCarousel!: ElementRef<HTMLDivElement>;

  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  public commercialProjects: ProjectItem[] = (projectsData as ProjectsData).commercial || [];
  public studyProjects: ProjectItem[] = (projectsData as ProjectsData).study || [];

  // Scroll state tracking
  public scrollStates = {
    commercial: { canScrollLeft: false, canScrollRight: true },
    study: { canScrollLeft: false, canScrollRight: true }
  };

  constructor() {
    // Component initialization
  }

  // TrackBy function for performance
  trackByProject(index: number, project: ProjectItem): string {
    return project.id;
  }

  // Scroll carousel left or right
  scrollCarousel(category: 'commercial' | 'study', direction: 'left' | 'right'): void {
    const carousel = category === 'commercial' ? this.commercialCarousel : this.studyCarousel;
    if (!carousel) return;

    const scrollAmount = 400; // Adjust based on card width
    const currentScroll = carousel.nativeElement.scrollLeft;
    const targetScroll =
      direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

    carousel.nativeElement.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
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

  // Calculate carousel width based on number of items
  getCarouselWidth(itemCount: number): number {
    const cardWidth = 400; // Base card width
    const gap = 16; // Gap between cards
    return cardWidth * itemCount + gap * (itemCount - 1);
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

  // Open project modal/details
  openProjectModal(project: ProjectItem): void {
    if (project.demoUrl) {
      this.openUrl(project.demoUrl);
    } else if (project.githubUrl) {
      this.openUrl(project.githubUrl);
    } else if (project.paperUrl) {
      this.openUrl(project.paperUrl);
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
}
