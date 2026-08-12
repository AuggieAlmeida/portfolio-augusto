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
import { TranslateModule } from '@ngx-translate/core';

import {
  CommandSuggestion,
  PortfolioCommandService
} from '../../core/commands/portfolio-command.service';
import { ScrollLockService } from '../../core/services/scroll-lock.service';

type Surface = 'terminal' | 'quick-open' | 'boot' | null;

const BOOT_DURATION_MS = 1400;

@Component({
  selector: 'app-command-center',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="sr-only" aria-live="polite">{{ bootMessage }}</p>

    <div
      *ngIf="surface"
      class="fixed inset-0 z-[60] flex items-end bg-black/60 p-3 backdrop-blur-sm md:items-center md:justify-center md:p-6"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="
        surface === 'terminal' ? 'Terminal' : surface === 'boot' ? 'Boot opcional' : 'Quick open'
      "
    >
      <button
        *ngIf="surface !== 'boot'"
        type="button"
        class="absolute inset-0 h-full w-full cursor-default"
        aria-label="Fechar"
        (click)="close()"
      ></button>

      <section
        *ngIf="surface === 'boot'"
        class="relative w-full max-w-md overflow-hidden rounded-2xl border border-primary-300 bg-primary-950 p-6 text-center text-primary-50 shadow-2xl dark:border-primary-600"
        aria-labelledby="boot-title"
        aria-describedby="boot-description"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.32em] text-primary-300">
          AUGGIE / PORTFOLIO
        </p>
        <h2 id="boot-title" class="mt-5 text-2xl font-semibold">Reiniciando experiência</h2>
        <p id="boot-description" class="mt-2 text-sm text-primary-200">Preparando o portfólio.</p>
        <div
          class="mt-6 h-1 overflow-hidden rounded-full bg-primary-800"
          role="progressbar"
          aria-label="Progresso do boot"
          aria-valuemin="0"
          aria-valuemax="100"
          [attr.aria-valuenow]="bootProgress"
        >
          <span class="boot-progress block h-full origin-left bg-primary-300"></span>
        </div>
        <button
          #skipBootButton
          type="button"
          class="mt-6 rounded-lg px-3 py-2 text-sm font-medium text-primary-100 underline decoration-primary-400 underline-offset-4 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-primary-950"
          (click)="skipBoot()"
        >
          Pular animação
        </button>
      </section>

      <section
        *ngIf="surface !== 'boot'"
        #surfacePanel
        class="relative flex max-h-[calc(100dvh-1.5rem)] w-full flex-col overflow-hidden rounded-2xl border border-primary-200 bg-white shadow-2xl dark:border-primary-800 dark:bg-primary-950 md:max-h-[85vh] md:max-w-2xl"
        [class.font-mono]="surface === 'terminal'"
      >
        <header
          class="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-primary-800"
        >
          <div>
            <p
              class="text-xs font-medium uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400"
            >
              {{ surface === 'terminal' ? 'Terminal' : 'Quick open' }}
            </p>
            <p class="text-sm text-neutral-600 dark:text-neutral-300">
              {{
                surface === 'terminal'
                  ? 'help para ver os comandos'
                  : 'Busque projetos, seções ou ações'
              }}
            </p>
          </div>
          <button
            #closeButton
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-neutral-200 dark:hover:bg-primary-800"
            aria-label="Fechar"
            (click)="close()"
          >
            <i aria-hidden="true" class="fas fa-times"></i>
          </button>
        </header>

        <div *ngIf="surface === 'terminal'" class="min-h-0 flex-1 overflow-y-auto p-4 text-sm">
          <p class="mb-3 text-primary-700 dark:text-primary-300">portfolio&#64;auggie:~$ help</p>
          <p *ngFor="let line of helpLines" class="text-neutral-600 dark:text-neutral-300">
            {{ line }}
          </p>
          <div *ngFor="let entry of history" class="mb-3">
            <p class="text-primary-700 dark:text-primary-300">
              portfolio&#64;auggie:~$ {{ entry.input }}
            </p>
            <p
              *ngFor="let line of entry.lines"
              class="whitespace-pre-line text-neutral-600 dark:text-neutral-300"
            >
              {{ line }}
            </p>
          </div>
        </div>

        <div *ngIf="surface === 'quick-open'" class="min-h-0 flex-1 overflow-y-auto p-2">
          <button
            *ngFor="let suggestion of suggestions; let i = index"
            type="button"
            class="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-primary-900/30"
            [class.command-suggestion-active]="i === activeSuggestion"
            (click)="choose(suggestion)"
          >
            <span>
              <span class="block font-medium text-neutral-900 dark:text-neutral-100">{{
                suggestion.label
              }}</span>
              <span class="block text-xs text-neutral-500 dark:text-neutral-400">{{
                suggestion.description
              }}</span>
            </span>
            <i
              aria-hidden="true"
              [class]="
                suggestion.kind === 'project'
                  ? 'fas fa-folder text-primary-500'
                  : 'fas fa-terminal text-primary-500'
              "
            ></i>
          </button>
          <p *ngIf="!suggestions.length" class="p-4 text-sm text-neutral-500 dark:text-neutral-400">
            Nenhuma ação encontrada.
          </p>
        </div>

        <form
          class="border-t border-neutral-200 p-3 dark:border-primary-800"
          (submit)="submit($event)"
        >
          <label class="sr-only" for="command-input">Comando ou busca</label>
          <div class="flex items-center gap-2">
            <span *ngIf="surface === 'terminal'" class="text-primary-600 dark:text-primary-400"
              >›</span
            >
            <input
              #commandInput
              id="command-input"
              type="text"
              autocomplete="off"
              [value]="input"
              (input)="setInput($event)"
              (keydown)="onInputKeydown($event)"
              [placeholder]="
                surface === 'terminal' ? 'Digite um comando' : 'Buscar projetos e ações'
              "
              class="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
            />
            <kbd
              *ngIf="surface === 'quick-open'"
              class="rounded border border-neutral-300 px-1.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-600"
              >↵</kbd
            >
          </div>
        </form>
      </section>
    </div>
  `,
  styles: [
    `
      .command-suggestion-active {
        background: rgb(224 231 255);
      }

      :host-context(.dark) .command-suggestion-active {
        background: rgb(49 46 129);
      }

      .boot-progress {
        animation: boot-progress ${BOOT_DURATION_MS}ms ease-out forwards;
      }

      @keyframes boot-progress {
        from {
          transform: scaleX(0);
        }

        to {
          transform: scaleX(1);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .boot-progress {
          animation: none;
          transform: scaleX(1);
        }
      }
    `
  ]
})
export class CommandCenterComponent {
  @ViewChild('commandInput') commandInput?: ElementRef<HTMLInputElement>;
  @ViewChild('skipBootButton') skipBootButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('surfacePanel') surfacePanel?: ElementRef<HTMLElement>;

  surface: Surface = null;
  input = '';
  activeSuggestion = 0;
  suggestions: CommandSuggestion[] = [];
  history: { input: string; lines: string[] }[] = [];
  bootMessage = '';
  bootProgress = 0;
  private readonly commands = inject(PortfolioCommandService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollLock = inject(ScrollLockService);
  private lastFocusedElement: HTMLElement | null = null;
  private bootTimer?: ReturnType<typeof setTimeout>;

  readonly helpLines = this.commands.helpLines;

  constructor() {
    this.commands.openSurface$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((surface) => {
      this.open(surface);
    });
    this.destroyRef.onDestroy(() => {
      this.clearBootTimer();
      this.setBackgroundInert(false);
      this.scrollLock.unlock('command-center');
    });
  }

  openTerminal(): void {
    this.commands.openTerminal();
  }

  open(surface: Exclude<Surface, null>): void {
    this.lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.surface = surface;
    this.input = '';
    this.activeSuggestion = 0;
    this.refreshSuggestions();
    this.scrollLock.lock('command-center');
    this.cdr.markForCheck();
    setTimeout(() => this.commandInput?.nativeElement.focus());
  }

  close(): void {
    if (!this.surface) return;
    if (this.surface === 'boot') {
      this.skipBoot();
      return;
    }
    this.surface = null;
    this.scrollLock.unlock('command-center');
    this.cdr.markForCheck();
    setTimeout(() => {
      if (this.lastFocusedElement?.isConnected) this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    });
  }

  setInput(event: Event): void {
    this.input = (event.target as HTMLInputElement).value;
    this.activeSuggestion = 0;
    this.refreshSuggestions();
  }

  submit(event: SubmitEvent): void {
    event.preventDefault();
    if (this.surface === 'quick-open') {
      const selected = this.suggestions[this.activeSuggestion];
      if (selected) this.choose(selected);
      return;
    }

    this.executeTerminalInput();
  }

  private executeTerminalInput(): void {
    const command = this.input;
    const result = this.commands.execute(command);
    if (result.effect === 'reboot') {
      this.startBoot();
      return;
    }
    if (result.effect === 'close') {
      this.close();
      return;
    }
    if (result.effect === 'clear') this.history = [];
    else if (command) this.history = [...this.history, { input: command, lines: result.lines }];
    this.input = '';
    if (command.trim().toLowerCase().startsWith('open ')) this.close();
  }

  skipBoot(): void {
    if (this.surface !== 'boot') return;
    this.finishBoot('Boot concluído.');
  }

  choose(suggestion: CommandSuggestion): void {
    const result = this.commands.execute(suggestion.input);
    if (result.effect !== 'clear') this.close();
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }
    if (this.surface === 'terminal' && event.key === 'Enter') {
      event.preventDefault();
      this.executeTerminalInput();
      return;
    }
    if (this.surface !== 'quick-open') return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const selected = this.suggestions[this.activeSuggestion];
      if (selected) this.choose(selected);
      return;
    }
    if (event.key === 'ArrowDown' && this.suggestions.length) {
      event.preventDefault();
      this.activeSuggestion = (this.activeSuggestion + 1) % this.suggestions.length;
    } else if (event.key === 'ArrowUp' && this.suggestions.length) {
      event.preventDefault();
      this.activeSuggestion =
        (this.activeSuggestion - 1 + this.suggestions.length) % this.suggestions.length;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKeydown(event: KeyboardEvent): void {
    if (!this.surface && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.commands.openQuickOpen();
    } else if (!this.surface && event.key === '`' && !this.isTypingTarget(event.target)) {
      event.preventDefault();
      this.commands.openTerminal();
    } else if (this.surface && event.key === 'Escape') {
      event.preventDefault();
      this.close();
    } else if (this.surface && event.key === 'Tab') {
      this.trapFocus(event, this.surfacePanel?.nativeElement);
    }
  }

  private refreshSuggestions(): void {
    this.suggestions = this.commands.suggestions(this.input);
  }

  private startBoot(): void {
    this.clearBootTimer();
    this.surface = 'boot';
    this.input = '';
    this.bootProgress = 0;
    this.bootMessage = 'Boot opcional iniciado.';
    this.setBackgroundInert(true);
    this.cdr.markForCheck();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.finishBoot('Animações reduzidas: boot concluído imediatamente.');
      return;
    }

    setTimeout(() => this.skipBootButton?.nativeElement.focus());
    this.bootTimer = setTimeout(() => this.finishBoot('Boot concluído.'), BOOT_DURATION_MS);
  }

  private finishBoot(message: string): void {
    this.clearBootTimer();
    this.surface = null;
    this.bootProgress = 100;
    this.bootMessage = message;
    this.setBackgroundInert(false);
    this.scrollLock.unlock('command-center');
    this.cdr.markForCheck();
    setTimeout(() => {
      if (this.lastFocusedElement?.isConnected) this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    });
  }

  private clearBootTimer(): void {
    if (this.bootTimer) clearTimeout(this.bootTimer);
    this.bootTimer = undefined;
  }

  private setBackgroundInert(inert: boolean): void {
    document.querySelectorAll('app-header, main').forEach((element) => {
      if (inert) element.setAttribute('inert', '');
      else element.removeAttribute('inert');
    });
  }

  private trapFocus(event: KeyboardEvent, container?: HTMLElement): void {
    if (!container) return;
    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]'
      )
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

  private isTypingTarget(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement
    );
  }
}
