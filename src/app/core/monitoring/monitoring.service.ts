import { Injectable, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { onFCP, onLCP, onCLS } from 'web-vitals';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private performanceMetrics = signal<{
    fcp: number;
    lcp: number;
    cls: number;
  }>({ fcp: 0, lcp: 0, cls: 0 });

  constructor(private router: Router) {
    this.initializeAnalytics();
    this.measureWebVitals();
  }

  private initializeAnalytics(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.sendPageView();
    });
  }

  private measureWebVitals(): void {
    onFCP(metric => {
      this.performanceMetrics.update(current => ({
        ...current,
        fcp: metric.value
      }));
    });

    onLCP(metric => {
      this.performanceMetrics.update(current => ({
        ...current,
        lcp: metric.value
      }));
    });

    onCLS(metric => {
      this.performanceMetrics.update(current => ({
        ...current,
        cls: metric.value
      }));
    });
  }

  private sendPageView(): void {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }
}