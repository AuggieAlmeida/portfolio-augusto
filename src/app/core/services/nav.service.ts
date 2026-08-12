// core/services/nav.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Tempo máximo esperando um bloco `@defer` renderizar antes de desistir do
 *  segundo scroll. Acima disso, a âncora já deixou o leitor no lugar certo. */
const DEFER_RENDER_TIMEOUT_MS = 3000;

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
    // Career, Projects e Skills entram por `@defer`: antes de hidratar, quem
    // existe no DOM é a âncora permanente que o app.component deixa fora do
    // bloco. Rolar até ela é o que dispara o gatilho de viewport.
    const anchor =
      document.getElementById(sectionId) ?? document.getElementById(`${sectionId}-anchor`);
    if (!anchor) return;

    this.scrollToElement(anchor, offset);
    this.setActive(sectionId);

    if (document.getElementById(sectionId)) return;
    this.whenRendered(sectionId, (element) => this.scrollToElement(element, offset));
  }

  private scrollToElement(element: HTMLElement, offset: number): void {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  /** Corrige o scroll assim que a seção adiada aparece no DOM. */
  private whenRendered(sectionId: string, action: (element: HTMLElement) => void): void {
    const observer = new MutationObserver(() => {
      const element = document.getElementById(sectionId);
      if (!element) return;
      observer.disconnect();
      clearTimeout(timeout);
      action(element);
    });

    const timeout = setTimeout(() => observer.disconnect(), DEFER_RENDER_TIMEOUT_MS);
    observer.observe(document.body, { childList: true, subtree: true });
  }
}
