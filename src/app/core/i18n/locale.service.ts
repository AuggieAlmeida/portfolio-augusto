import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { DEFAULT_LOCALE, isLocale, Locale } from './locales';

const STORAGE_KEY = 'locale';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly translate = inject(TranslateService);
  private readonly subject = new BehaviorSubject<Locale>(DEFAULT_LOCALE);

  readonly locale$ = this.subject.asObservable();

  get current(): Locale {
    return this.subject.value;
  }

  init(): void {
    this.translate.setFallbackLang(DEFAULT_LOCALE);
    this.apply(this.resolveInitial());
  }

  set(locale: Locale): void {
    if (locale === this.current) return;
    localStorage.setItem(STORAGE_KEY, locale);
    this.apply(locale);
  }

  private apply(locale: Locale): void {
    this.translate.use(locale);
    document.documentElement.lang = locale;
    this.subject.next(locale);
  }

  /** Stored choice wins over the browser so a manual switch survives a reload. */
  private resolveInitial(): Locale {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;

    const browser = navigator.language?.split('-')[0];
    return isLocale(browser) ? browser : DEFAULT_LOCALE;
  }
}
