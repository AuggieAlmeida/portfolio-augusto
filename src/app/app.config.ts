import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  inject,
  provideAppInitializer
} from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG, TranslateHttpLoader } from '@ngx-translate/http-loader';

import { GlobalErrorHandler } from './core/error-handling/global-error-handler';
import { LocaleService } from './core/i18n/locale.service';
import { DEFAULT_LOCALE } from './core/i18n/locales';
import { MonitoringService } from './core/monitoring/monitoring.service';

export function HttpLoaderFactory() {
  return new TranslateHttpLoader();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideAppInitializer(() => inject(MonitoringService).start()),
    provideAppInitializer(() => inject(LocaleService).init()),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: { prefix: 'assets/i18n/', suffix: '.json' }
    },
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
