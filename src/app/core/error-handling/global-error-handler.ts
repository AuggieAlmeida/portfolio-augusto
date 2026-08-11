import { ErrorHandler, inject, Injectable } from '@angular/core';
import * as Sentry from '@sentry/angular';

import { environment } from '../../../environments/environment';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggingService);

  handleError(error: unknown): void {
    this.logger.error('Unhandled error', error);

    if (environment.sentryDsn) {
      Sentry.captureException(error);
    }
  }
}
