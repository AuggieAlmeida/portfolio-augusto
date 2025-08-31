import { ErrorHandler, Injectable, inject } from '@angular/core';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private loggingService = inject(LoggingService);

  handleError(error: Error): void {
    this.loggingService.log('error', 'An error occurred:', error);
    // Implementar lógica de fallback UI
  }
}