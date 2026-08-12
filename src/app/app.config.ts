import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer
} from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { GlobalErrorHandler } from './core/error-handling/global-error-handler';
import { BundledTranslateLoader } from './core/i18n/bundled-translate.loader';
import { LocaleService } from './core/i18n/locale.service';
import { DEFAULT_LOCALE } from './core/i18n/locales';
import { MonitoringService } from './core/monitoring/monitoring.service';

export function HttpLoaderFactory() {
  return new BundledTranslateLoader();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideAppInitializer(() => inject(MonitoringService).start()),
    provideAppInitializer(() => inject(LocaleService).init()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: []
        },
        fallbackLang: DEFAULT_LOCALE
      })
    )
  ]
};
