import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  const originalLang = document.documentElement.lang;

  const build = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot()] });
    return TestBed.inject(LocaleService);
  };

  beforeEach(() => localStorage.clear());

  afterAll(() => {
    localStorage.clear();
    document.documentElement.lang = originalLang;
  });

  it('defaults to pt before init', () => {
    expect(build().current).toBe('pt');
  });

  it('restores the stored locale on init', () => {
    localStorage.setItem('locale', 'en');

    const service = build();
    service.init();

    expect(service.current).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('ignores a stored value that is not a supported locale', () => {
    localStorage.setItem('locale', 'de');

    const service = build();
    service.init();

    expect(service.current).toBe('pt');
  });

  it('persists a switch so it survives a reload', () => {
    const service = build();
    service.init();

    service.set('en');

    expect(localStorage.getItem('locale')).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('emits every applied locale', () => {
    const service = build();
    const seen: string[] = [];
    service.locale$.subscribe((locale) => seen.push(locale));

    service.init();
    service.set('en');
    service.set('en');

    expect(seen.at(-1)).toBe('en');
    expect(seen.filter((locale) => locale === 'en').length).toBe(1);
  });
});
