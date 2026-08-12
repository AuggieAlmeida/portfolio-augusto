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
});
