import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { LocaleService } from '../i18n/locale.service';
import { isLocale } from '../i18n/locales';
import { ProjectCatalogService, ProjectItem } from '../projects/project-catalog.service';
import { NavService } from '../services/nav.service';
import { ThemeService } from '../services/theme.service';

export type CommandEffect = 'clear' | 'close';

export interface CommandResult {
  lines: string[];
  effect?: CommandEffect;
}

export interface CommandSuggestion {
  input: string;
  label: string;
  description: string;
  kind: 'command' | 'project';
}

/** Executa ações reais do portfolio; as duas superfícies de comando só as apresentam. */
@Injectable({ providedIn: 'root' })
export class PortfolioCommandService {
  readonly helpLines = [
    'help — mostra os comandos disponíveis',
    'about — vai para Sobre',
    'career — vai para Trajetória',
    'skills — vai para Habilidades',
    'contact — vai para Contato',
    'projects — vai para Projetos',
    'open <slug> — abre o projeto correspondente',
    'search <termo> — busca nos projetos',
    'theme dark|light — altera o tema',
    'lang pt|en — altera o idioma',
    'clear — limpa o histórico',
    'exit — fecha o terminal',
    'reboot — inicia o boot opcional'
  ];

  private readonly catalog = inject(ProjectCatalogService);
  private readonly locale = inject(LocaleService);
  private readonly nav = inject(NavService);
  private readonly theme = inject(ThemeService);
  private readonly translate = inject(TranslateService);

  private readonly openProjectSubject = new Subject<ProjectItem>();
  readonly openProject$ = this.openProjectSubject.asObservable();

  private readonly openSurfaceSubject = new Subject<'terminal' | 'quick-open'>();
  readonly openSurface$ = this.openSurfaceSubject.asObservable();

  openTerminal(): void {
    this.openSurfaceSubject.next('terminal');
  }

  openQuickOpen(): void {
    this.openSurfaceSubject.next('quick-open');
  }

  execute(rawInput: string): CommandResult {
    const input = rawInput.trim();
    if (!input) return { lines: [] };

    const [command, ...argumentsList] = input.split(/\s+/);
    const argument = argumentsList.join(' ');

    switch (command.toLowerCase()) {
      case 'help':
        return { lines: this.helpLines };
      case 'about':
      case 'career':
      case 'skills':
      case 'projects':
        this.navigate(command.toLowerCase());
        return { lines: [`Abrindo ${command.toLowerCase()}.`] };
      case 'contact':
        this.navigate('contact');
        return { lines: ['Abrindo contato.'] };
      case 'open':
        return this.openProject(argument);
      case 'search':
        return this.searchProjects(argument);
      case 'theme':
        return this.setTheme(argument);
      case 'lang':
        return this.setLocale(argument);
      case 'clear':
        return { lines: [], effect: 'clear' };
      case 'exit':
        return { lines: [], effect: 'close' };
      case 'reboot':
        return { lines: ['Boot é opcional e será acionado por este comando na próxima fatia.'] };
      default:
        return { lines: [`Comando não reconhecido: ${command}. Use help.`] };
    }
  }

  suggestions(input: string): CommandSuggestion[] {
    const normalized = input.trim().toLowerCase();
    const commands: CommandSuggestion[] = [
      ['help', 'Help', 'Lista os comandos disponíveis'],
      ['about', 'About', 'Vai para Sobre'],
      ['career', 'Career', 'Vai para Trajetória'],
      ['projects', 'Projects', 'Vai para Projetos'],
      ['skills', 'Skills', 'Vai para Habilidades'],
      ['contact', 'Contact', 'Vai para Contato'],
      ['theme dark', 'Theme dark', 'Ativa o tema escuro'],
      ['theme light', 'Theme light', 'Ativa o tema claro'],
      ['lang pt', 'Lang pt', 'Muda para português'],
      ['lang en', 'Lang en', 'Muda para inglês']
    ].map(([command, label, description]) => ({
      input: command,
      label,
      description,
      kind: 'command' as const
    }));

    const projects = this.catalog
      .search(normalized.replace(/^open\s+/, ''), this.translate)
      .map((project) => ({
        input: `open ${project.id}`,
        label: this.translate.instant(project.titleKey),
        description: project.id,
        kind: 'project' as const
      }));

    const candidates = normalized.startsWith('open ')
      ? projects
      : normalized
        ? [...commands, ...projects]
        : commands;
    return candidates
      .filter(
        (item) => !normalized || `${item.input} ${item.label}`.toLowerCase().includes(normalized)
      )
      .slice(0, 8);
  }

  private navigate(section: string): void {
    const headerHeight = document.querySelector('header')?.clientHeight || 64;
    this.nav.scrollTo(section === 'about' ? 'about' : section, headerHeight - 20);
  }

  private openProject(slug: string): CommandResult {
    const project = this.catalog.find(slug);
    if (!project) return { lines: [`Projeto não encontrado: ${slug || '(sem slug)'}.`] };

    this.navigate('projects');
    this.openProjectSubject.next(project);
    return { lines: [`Abrindo ${this.translate.instant(project.titleKey)}.`] };
  }

  private searchProjects(query: string): CommandResult {
    const projects = this.catalog.search(query, this.translate);
    if (!projects.length) return { lines: ['Nenhum projeto encontrado.'] };

    return {
      lines: projects.map(
        (project) => `${project.id} — ${this.translate.instant(project.titleKey)}`
      )
    };
  }

  private setTheme(value: string): CommandResult {
    if (value !== 'dark' && value !== 'light') return { lines: ['Use theme dark ou theme light.'] };

    this.theme.setTheme(value);
    return { lines: [`Tema ${value} aplicado.`] };
  }

  private setLocale(value: string): CommandResult {
    if (!isLocale(value)) return { lines: ['Use lang pt ou lang en.'] };

    this.locale.set(value);
    return { lines: [`Idioma ${value} aplicado.`] };
  }
}
