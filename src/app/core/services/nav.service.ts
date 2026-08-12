// core/services/nav.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private activeSectionSubject = new BehaviorSubject<string>('hero');
  active$ = this.activeSectionSubject.asObservable();

  setActive(section: string) {
    this.activeSectionSubject.next(section);
  }

  scrollTo(sectionId: string, offset = 0) {
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
      this.setActive(sectionId);
    }
  }
}
