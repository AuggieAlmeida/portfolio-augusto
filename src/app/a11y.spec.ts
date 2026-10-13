import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import * as axe from 'axe-core';
import { firstValueFrom } from 'rxjs';

import { AboutComponent } from './components/about/about.component';
import { CareerRoadmapComponent } from './components/carrer/carrer.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';
import { BundledTranslateLoader } from './core/i18n/bundled-translate.loader';
import { ThemeService } from './core/services/theme.service';

/**
 * As seções montadas sem `@defer`, no mesmo fundo do `<main>` real. O gate de
 * contraste precisa da página renderizada, e o `@defer (on viewport)` deixaria
 * carreira, projetos e habilidades fora da medição.
 */
@Component({
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    CareerRoadmapComponent,
    ProjectsComponent,
    SkillsComponent,
    FooterComponent
  ],
  template: `
    <app-header></app-header>
    <main class="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <app-hero></app-hero>
      <app-about></app-about>
      <app-career></app-career>
      <app-projects></app-projects>
      <app-skills></app-skills>
    </main>
    <app-footer></app-footer>
  `
})
class PageHostComponent {}

// Entradas com `opacity-0` só aparecem no fim do `fadeInUp`; sem encurtar a
// animação, o axe as trataria como ocultas e pularia exatamente os cards.
const SETTLE_MOTION = `*, *::before, *::after {
  animation-duration: 0.01ms !important;
  animation-delay: 0s !important;
  animation-iteration-count: 1 !important;
  transition: none !important;
}`;

const describeViolations = (violations: axe.Result[]): string[] =>
  violations.flatMap((violation) =>
    violation.nodes.map(
      (node) => `${violation.id}: ${node.target.join(' ')} — ${node.failureSummary ?? ''}`
    )
  );

describe('Accessibility gate (axe-core, WCAG 2.1 AA)', () => {
  let motionStyle: HTMLStyleElement;

  beforeEach(async () => {
    motionStyle = document.createElement('style');
    motionStyle.textContent = SETTLE_MOTION;
    document.head.appendChild(motionStyle);

    await TestBed.configureTestingModule({
      imports: [
        PageHostComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: BundledTranslateLoader }
        })
      ]
    }).compileComponents();

    await firstValueFrom(TestBed.inject(TranslateService).use('pt'));
  });

  afterEach(() => {
    motionStyle.remove();
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  });

  for (const theme of ['light', 'dark'] as const) {
    it(`has no WCAG A/AA violations in the ${theme} theme`, async () => {
      const fixture = TestBed.createComponent(PageHostComponent);
      TestBed.inject(ThemeService).setTheme(theme);
      fixture.detectChanges();
      // Sem `whenStable()`: o letreiro de cargos do herói reagenda o próprio
      // timer para sempre, e a zona nunca fica estável.
      await new Promise((resolve) => setTimeout(resolve, 100));

      const result = await axe.run(fixture.nativeElement, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
      });

      expect(describeViolations(result.violations)).toEqual([]);
    }, 30000);
  }
});
