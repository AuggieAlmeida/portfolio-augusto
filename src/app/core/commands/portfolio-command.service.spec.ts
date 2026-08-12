import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NavService } from '../services/nav.service';
import { ThemeService } from '../services/theme.service';
import { PortfolioCommandService } from './portfolio-command.service';

describe('PortfolioCommandService', () => {
  let service: PortfolioCommandService;
  let nav: NavService;
  let theme: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot()] });
    service = TestBed.inject(PortfolioCommandService);
    nav = TestBed.inject(NavService);
    theme = TestBed.inject(ThemeService);
  });

  it('opens a project from the catalog by its existing slug', () => {
    const opened: string[] = [];
    service.openProject$.subscribe((project) => opened.push(project.id));
    spyOn(nav, 'scrollTo');

    const result = service.execute('open jarbas');

    expect(opened).toEqual(['jarbas']);
    expect(result.lines[0]).toContain('Abrindo');
    expect(nav.scrollTo).toHaveBeenCalled();
  });

  it('searches real catalog entries without duplicating project data', () => {
    const result = service.execute('search pokedex');

    expect(result.lines.some((line) => line.startsWith('pokedex —'))).toBeTrue();
  });

  it('delegates theme changes to the existing ThemeService', () => {
    spyOn(theme, 'setTheme');

    service.execute('theme dark');

    expect(theme.setTheme).toHaveBeenCalledWith('dark');
  });

  it('starts the optional boot only when reboot is explicitly requested', () => {
    expect(service.execute('reboot')).toEqual({ lines: [], effect: 'reboot' });
  });

  it('offers section commands and matching catalog projects in quick open', () => {
    const suggestions = service.suggestions('ca');

    expect(suggestions.some((item) => item.input === 'career')).toBeTrue();
    expect(suggestions.some((item) => item.input === 'open calc-financeira')).toBeTrue();
  });

  describe('cv', () => {
    let clicked: HTMLAnchorElement[];

    beforeEach(() => {
      clicked = [];
      // Sem o spy, o Karma tentaria baixar o PDF de verdade a cada caso.
      spyOn(HTMLAnchorElement.prototype, 'click').and.callFake(function (this: HTMLAnchorElement) {
        clicked.push(this);
      });
    });

    it('downloads the CV of the locale in use when no language is given', () => {
      const result = service.execute('cv');

      expect(clicked.length).toBe(1);
      expect(clicked[0].getAttribute('href')).toBe('assets/cv/Augusto-Almeida-CV-pt-BR.pdf');
      expect(clicked[0].getAttribute('download')).toBe('Augusto-Almeida-CV-pt-BR.pdf');
      expect(result.lines[0]).toContain('português');
    });

    it('honours an explicit language over the current locale', () => {
      service.execute('cv en');

      expect(clicked[0].getAttribute('href')).toBe('assets/cv/Augusto-Almeida-CV-en.pdf');
    });

    it('refuses an unsupported language instead of downloading the default', () => {
      const result = service.execute('cv fr');

      expect(clicked.length).toBe(0);
      expect(result.lines).toEqual(['Use cv, cv pt ou cv en.']);
    });

    it('leaves no anchor behind in the document', () => {
      service.execute('cv');

      expect(document.querySelector('a[download]')).toBeNull();
    });

    it('announces the command in help and in quick open', () => {
      expect(service.helpLines.some((line) => line.startsWith('cv '))).toBeTrue();
      expect(service.suggestions('cv').some((item) => item.input === 'cv en')).toBeTrue();
    });
  });
});
