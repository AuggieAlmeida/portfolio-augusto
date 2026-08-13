import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    fixture.detectChanges();
  });

  it('cycles the roles in the subtitle and keeps the positioning line below it', () => {
    const host: HTMLElement = fixture.nativeElement;
    const component = fixture.componentInstance;

    expect(host.querySelector('.typewriter')).not.toBeNull();
    // A lista inteira é anunciada uma vez ao leitor de tela, em vez de letra a letra.
    expect(host.querySelector('.sr-only')?.textContent).toContain('Fullstack Developer');
    expect(host.textContent).toContain('hero.positioning');
    expect(component.roles.length).toBeGreaterThan(1);
  });

  it('never leaves the subtitle empty when motion is reduced', () => {
    const component = fixture.componentInstance;
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);

    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(component.typed).toBe(component.roles[0]);
    expect(component.typing).toBeFalse();
  });

  it('serves the portrait through responsive derivatives', () => {
    const host: HTMLElement = fixture.nativeElement;
    const picture = host.querySelector('picture');

    expect(picture?.querySelector('source[type="image/avif"]')?.getAttribute('srcset')).toContain(
      '.avif '
    );
    expect(picture?.querySelector('img')?.getAttribute('width')).toBe('192');
  });

  it('renders the final stat values before the counter runs', () => {
    const host: HTMLElement = fixture.nativeElement;
    const stats = Array.from(host.querySelectorAll('.stat-number')).map((element) =>
      element.textContent?.trim()
    );

    // O valor final já está no HTML: se o observador não rodar, o visitante lê
    // o número certo em vez de "0+".
    expect(stats).toEqual(['5+', '35+']);
    expect(host.textContent).toContain('stats.liveProjects');
    expect(host.textContent).not.toContain('stats.languagesDominated');
    expect(host.textContent).not.toContain('stats.measuredSpeedup');
  });

  it('states the live-project count exactly, without the counter suffix', () => {
    const host: HTMLElement = fixture.nativeElement;
    const label = Array.from(host.querySelectorAll('div')).find((element) =>
      element.textContent?.trim().startsWith('stats.liveProjects')
    );
    const value = label?.previousElementSibling as HTMLElement | null;

    // Contado, não estimado: o contador anima com sufixo "+", e "14+" mentiria
    // sobre um número que o visitante confere clicando nos cards.
    expect(value?.textContent?.trim()).toBe('14');
    expect(value?.classList.contains('stat-number')).toBeFalse();
  });

  it('offers the CV in both languages as downloadable one-page PDFs', () => {
    const host: HTMLElement = fixture.nativeElement;
    const pt = host.querySelector<HTMLAnchorElement>('[data-cv="pt-BR"]');
    const en = host.querySelector<HTMLAnchorElement>('[data-cv="en"]');

    expect(pt?.getAttribute('href')).toBe('assets/cv/Augusto-Almeida-CV-pt-BR.pdf');
    expect(en?.getAttribute('href')).toBe('assets/cv/Augusto-Almeida-CV-en.pdf');
    expect(pt?.hasAttribute('download')).toBeTrue();
    expect(en?.hasAttribute('download')).toBeTrue();
    expect(pt?.getAttribute('hreflang')).toBe('pt-BR');
    expect(en?.getAttribute('hreflang')).toBe('en');
  });
});
