import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

import { PortfolioCommandService } from '../../core/commands/portfolio-command.service';
import { NavService } from '../../core/services/nav.service';

const sectionKeys: Record<string, string> = {
  hero: 'nav.home',
  about: 'nav.about',
  career: 'nav.carrer',
  projects: 'nav.projects',
  skills: 'nav.skills'
};

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="mx-auto hidden w-full items-center justify-center gap-3 border-b border-primary-200 bg-white/95 px-4 py-2 text-xs text-neutral-700 shadow-sm shadow-primary-950/5 backdrop-blur dark:border-primary-800 dark:bg-primary-950/95 dark:text-neutral-200 xl:flex"
      [attr.aria-label]="'statusBar.label' | translate"
    >
      <span class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
        {{ 'statusBar.section' | translate }}: {{ sectionKey | translate }}
      </span>
      <span class="h-4 w-px bg-primary-200 dark:bg-primary-800" aria-hidden="true"></span>
      <button
        type="button"
        class="rounded-md px-1.5 py-1 font-medium transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-primary-800"
        (click)="openTerminal()"
      >
        <i aria-hidden="true" class="fas fa-terminal mr-1"></i
        >{{ 'statusBar.terminal' | translate }}
      </button>
      <a
        class="rounded-md px-1.5 py-1 font-medium transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-primary-800"
        href="mailto:augusto.almeida2@icloud.com"
      >
        <i aria-hidden="true" class="fas fa-envelope mr-1"></i>{{ 'statusBar.contact' | translate }}
      </a>
    </aside>
  `
})
export class StatusBarComponent {
  sectionKey = sectionKeys['hero'];
  private readonly commands = inject(PortfolioCommandService);
  private readonly nav = inject(NavService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.nav.active$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((section) => {
      this.sectionKey = sectionKeys[section] ?? sectionKeys['hero'];
      this.cdr.markForCheck();
    });
  }

  openTerminal(): void {
    this.commands.openTerminal();
  }
}
