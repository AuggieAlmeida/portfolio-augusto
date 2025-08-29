import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, ...args: any[]): void {
    if (!environment.production || level !== 'debug') {
      console[level](message, ...args);
      // Aqui você pode adicionar integração com serviços como Sentry, LogRocket, etc
    }
  }
}