import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

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
      <!-- Só indicador de seção. Terminal voltou para o botão flutuante e o
           contato saiu: o herói já tem CTA de contato, e ter o mesmo alvo em
           três lugares só multiplicava o que podia quebrar. -->
      <span class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
        {{ 'statusBar.section' | translate }}: {{ sectionKey | translate }}
      </span>
    </aside>
  `
})
export class StatusBarComponent {
  sectionKey = sectionKeys['hero'];
  private readonly nav = inject(NavService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.nav.active$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((section) => {
      this.sectionKey = sectionKeys[section] ?? sectionKeys['hero'];
      this.cdr.markForCheck();
    });
  }
}
