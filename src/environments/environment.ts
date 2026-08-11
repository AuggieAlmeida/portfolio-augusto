import type { LogLevel } from '../app/core/logging/log-level';

export const environment = {
  production: false,
  logLevel: 'debug' as LogLevel,
  /**
   * Sentry DSN is public by design and safe to commit. Empty string disables
   * Sentry entirely instead of booting it into a broken state.
   */
  sentryDsn: ''
};
