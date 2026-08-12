import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  const originalLang = document.documentElement.lang;
  const originalNavigatorLanguage = navigator.language;
  const originalLanguage = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(navigator),
    'language'
  );

  /**
   * O serviço cai para `navigator.language` quando não há escolha armazenada, então o idioma
   * do runner decidiria o resultado: `pt-BR` na máquina local, `en-US` no Linux do CI. Fixar
   * aqui é o que mantém o teste falando do serviço em vez do ambiente.
   */
  const stubBrowserLanguage = (language: string) =>
    Object.defineProperty(navigator, 'language', { value: language, configurable: true });

  const build = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot()] });
    return TestBed.inject(LocaleService);
  };

  beforeEach(() => {
    localStorage.clear();
    stubBrowserLanguage('pt-BR');
  });

  afterAll(() => {
    localStorage.clear();
    document.documentElement.lang = originalLang;

    // `language` é definido no protótipo em todo navegador que roda a suíte; o `??` só existe
    // para não deixar o stub vazado caso alguém rode isto num ambiente que não a tenha.
    Object.defineProperty(
      navigator,
      'language',
      originalLanguage ?? { value: originalNavigatorLanguage, configurable: true }
    );
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

  it('falls back to the browser language when nothing is stored', () => {
    stubBrowserLanguage('en-US');

    const service = build();
    service.init();

    expect(service.current).toBe('en');
  });

  it('falls back to pt when the browser language is not supported', () => {
    stubBrowserLanguage('de-DE');

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
