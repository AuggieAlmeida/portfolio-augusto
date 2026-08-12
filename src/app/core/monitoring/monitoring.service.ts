import { inject, Injectable, signal } from '@angular/core';
import { Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

import { LoggingService } from '../logging/logging.service';

export type VitalName = 'cls' | 'fcp' | 'inp' | 'lcp' | 'ttfb';

export type WebVitals = Record<VitalName, number | null>;

const EMPTY_VITALS: WebVitals = { cls: null, fcp: null, inp: null, lcp: null, ttfb: null };

/**
 * Collects Core Web Vitals locally. There is no analytics backend wired up:
 * the numbers surface through `vitals` and the debug log, which is what a
 * single-page portfolio actually needs. Adding a vendor here would mean
 * shipping a tracker to visitors for data nobody reads.
 */
@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private readonly logger = inject(LoggingService);
  private readonly metrics = signal<WebVitals>(EMPTY_VITALS);

  readonly vitals = this.metrics.asReadonly();

  start(): void {
    onCLS((metric) => this.record('cls', metric));
    onFCP((metric) => this.record('fcp', metric));
    onINP((metric) => this.record('inp', metric));
    onLCP((metric) => this.record('lcp', metric));
    onTTFB((metric) => this.record('ttfb', metric));
  }

  private record(name: VitalName, metric: Metric): void {
    this.metrics.update((current) => ({ ...current, [name]: metric.value }));
    this.logger.debug(`web-vital ${metric.name}`, { value: metric.value, rating: metric.rating });
  }
}
