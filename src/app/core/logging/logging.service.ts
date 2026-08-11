import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { LOG_LEVELS, LogLevel } from './log-level';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly threshold = LOG_LEVELS.indexOf(environment.logLevel);

  log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (LOG_LEVELS.indexOf(level) < this.threshold) return;
    console[level](message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args);
  }
}
