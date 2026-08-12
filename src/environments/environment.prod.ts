import type { LogLevel } from '../app/core/logging/log-level';

export const environment = {
  production: true,
  logLevel: 'warn' as LogLevel,
  sentryDsn: ''
};
