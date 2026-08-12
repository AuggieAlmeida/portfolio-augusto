import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CONTACT_EMAIL } from '../../core/contact/contact-channels';
import { ClipboardService } from '../../core/services/clipboard.service';

/** Tempo que o botão fica em estado "copiado" antes de voltar ao normal. */
const FEEDBACK_MS = 2000;

/**
 * Copiar o e-mail em um clique. O endereço continua sendo um `mailto:` ao lado
 * — quem tem cliente de e-mail configurado usa o link, e quem vai colar em
 * outro lugar usa o botão em vez de selecionar o texto na mão.
 *
 * O resultado é anunciado por `role="status"`: sem isso, a troca do ícone só
 * existiria para quem enxerga a tela.
 */
@Component({
  selector: 'app-copy-email',
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      data-copy-email
      data-card-control
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary-200 text-primary-600 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-primary-700 dark:text-primary-300 dark:hover:bg-primary-900/30"
      [attr.aria-label]="'contact.copyEmail' | translate"
      [title]="'contact.copyEmail' | translate"
      (click)="copy()"
    >
      <i
        aria-hidden="true"
        class="fas text-xs"
        [class.fa-copy]="!copied"
        [class.fa-check]="copied"
      ></i>
    </button>
    <span class="sr-only" role="status">{{ status }}</span>
  `
})
export class CopyEmailComponent {
  copied = false;
  status = '';

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly clipboard = inject(ClipboardService);
  private readonly translate = inject(TranslateService);
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.clearTimer());
  }

  async copy(): Promise<void> {
    const ok = await this.clipboard.copy(CONTACT_EMAIL);
    this.copied = ok;
    this.status = this.translate.instant(ok ? 'contact.emailCopied' : 'contact.copyFailed');
    this.cdr.markForCheck();

    this.clearTimer();
    this.timer = setTimeout(() => {
      this.copied = false;
      this.status = '';
      this.cdr.markForCheck();
    }, FEEDBACK_MS);
  }

  private clearTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }
}
