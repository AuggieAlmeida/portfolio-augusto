import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer
      id="contact"
      class="relative bg-neutral-100 dark:bg-primary-950 text-neutral-700 dark:text-neutral-200 border-t border-neutral-200 dark:border-neutral-800"
      role="contentinfo"
    >
      <div class="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Branding / About -->
        <div>
          <h3 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            {{ 'footer.brand.title' | translate }}
          </h3>
          <p class="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
            {{ 'footer.brand.description' | translate }}
          </p>

          <div class="flex space-x-4 mt-4">
            <a
              [href]="'https://github.com/' + ('footer.social.github_user' | translate)"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              class="hover:text-primary-500"
            >
              <i class="fab fa-github text-xl" aria-hidden="true"></i>
            </a>

            <a
              [href]="'https://www.linkedin.com/in/' + ('footer.social.linkedin_user' | translate)"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              class="hover:text-primary-500"
            >
              <i class="fab fa-linkedin text-xl" aria-hidden="true"></i>
            </a>

            <a
              href="mailto:augusto.almeida2@icloud.com"
              aria-label="Email Pedro"
              class="hover:text-primary-500"
            >
              <i class="fas fa-envelope text-xl" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            {{ 'footer.links.title' | translate }}
          </h3>

          <ul class="mt-4 space-y-2 text-sm">
            <li>
              <a href="/index.html" class="hover:text-primary-500 transition-colors">
                {{ 'nav.home' | translate }}
              </a>
            </li>
            <li>
              <a href="#projects" class="hover:text-primary-500 transition-colors">
                {{ 'nav.projects' | translate }}
              </a>
            </li>
            <!--<li>
              <a href="/html/contact.html" class="hover:text-primary-500 transition-colors">
                {{ 'nav.contact' | translate }}
              </a>
            </li> -->
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            {{ 'footer.contact.title' | translate }}
          </h3>

          <ul class="mt-4 space-y-3 text-sm">
            <li class="flex items-center gap-2">
              <i class="fas fa-envelope text-primary-500" aria-hidden="true"></i>
              <a
                href="mailto:augusto.almeida2@icloud.com"
                class="hover:text-primary-500 transition-colors"
              >
                augusto.almeida2&#64;icloud.com
              </a>
            </li>

            <li class="flex items-center gap-2">
              <i class="fas fa-map-marker-alt text-primary-500" aria-hidden="true"></i>
              <span>{{ 'footer.contact.location' | translate }}</span>
            </li>

            <li class="flex items-center gap-2">
              <i class="fas fa-clock text-primary-500" aria-hidden="true"></i>
              <span>{{ 'footer.contact.timezone' | translate }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-neutral-200 dark:border-neutral-800 text-center py-4 text-sm text-neutral-500 dark:text-neutral-400"
      >
        {{ 'footer.copyright' | translate }}
      </div>
    </footer>
  `
})
export class FooterComponent {}
