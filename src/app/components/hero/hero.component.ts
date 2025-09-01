import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  template: `
    <section class="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-950 dark:via-secondary-950 dark:to-accent-950">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%236366f1&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-100/20 via-transparent to-secondary-100/20 dark:from-primary-800/20 dark:to-secondary-800/20 animate-pulse-slow"></div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 dark:bg-primary-700/30 rounded-full blur-xl animate-float"></div>
      <div class="absolute bottom-20 right-20 w-40 h-40 bg-secondary-200/30 dark:bg-secondary-700/30 rounded-full blur-xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-accent-200/30 dark:bg-accent-700/30 rounded-full blur-lg animate-float-slow"></div>

      <!-- Main Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <div class="max-w-4xl mx-auto">
          <!-- Profile Picture -->
          <div class="mb-8 flex justify-center">
            <div class="relative group">
              <div class="w-48 h-48 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 dark:from-primary-600 dark:to-secondary-700 p-1 shadow-2xl group-hover:shadow-primary-500/25 transition-all duration-500">
                <div class="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-neutral-700">
                  <img 
                    src="assets/images/hero/hero.jpeg" 
                    alt="Augusto Almeida - Fullstack Developer" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="eager"
                  />
                </div>
              </div>
              <!-- Glow effect -->
              <div class="absolute inset-0 rounded-full bg-primary-400/20 dark:bg-primary-600/20 blur-xl group-hover:bg-primary-400/40 dark:group-hover:bg-primary-600/40 transition-all duration-500"></div>
            </div>
          </div>

          <!-- Main Title -->
          <h1 class="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            <span class="text-neutral-800 dark:text-neutral-100 font-heading">Augusto</span>
            <span class="text-primary-600 dark:text-primary-400 font-display text-7xl md:text-9xl"> Almeida</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-xl text-neutral-500 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up font-sans">
            <span class="font-medium">{{ 'hero.subtitle' | translate }}</span>
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up">
            <button class="btn-primary group">
              <span class="flex items-center gap-2">
                <i class="fas fa-rocket w-5 h-5"></i>
                {{ 'CTA.viewProjects' | translate }}
                <i class="fas fa-arrow-right w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
              </span>
            </button>
            <button class="btn-secondary group">
              <span class="flex items-center gap-2">
                <i class="fas fa-envelope w-5 h-5"></i>
                {{ 'CTA.contactMe' | translate }}
                <i class="fas fa-arrow-right w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
              </span>
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up">
            <div class="text-center group">
              <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform font-heading">
                5+
              </div>
              <div class="text-neutral-600 dark:text-neutral-400 font-medium font-sans">
                {{ 'stats.yearsOfExperience' | translate }}
              </div>
            </div>
            <div class="text-center group">
              <div class="text-4xl font-bold text-secondary-600 dark:text-secondary-400 mb-2 group-hover:scale-110 transition-transform font-heading">
                20+
              </div>
              <div class="text-neutral-600 dark:text-neutral-400 font-medium font-sans">
                {{ 'stats.completedProjects' | translate }}
              </div>
            </div>
            <div class="text-center group">
              <div class="text-4xl font-bold text-accent-600 dark:text-accent-400 mb-2 group-hover:scale-110 transition-transform font-heading">
                4
              </div>
              <div class="text-neutral-600 dark:text-neutral-400 font-medium font-sans">
                {{ 'stats.languagesDominated' | translate }}
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div class="flex justify-center space-x-6 mt-12 animate-slide-up">
            <a href="#" class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <i class="fab fa-github text-2xl"></i>
            </a>
            <a href="#" class="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <i class="fab fa-linkedin text-2xl"></i>
            </a>
            <a href="#" class="text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <i class="fab fa-twitter text-2xl"></i>
            </a>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-float-delayed {
      animation: float 6s ease-in-out infinite 2s;
    }
    
    .animate-float-slow {
      animation: float 8s ease-in-out infinite 1s;
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(-50px) rotate(0deg);
      }
      33% {
        transform: translateY(-70px) rotate(120deg);
      }
      66% {
        transform: translateY(-60px) rotate(240deg);
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, TranslateModule]
})
export class HomeComponent {}
