import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CareerRoadmapComponent } from './carrer.component';

describe('CareerRoadmapComponent', () => {
  let fixture: ComponentFixture<CareerRoadmapComponent>;
  let component: CareerRoadmapComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerRoadmapComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CareerRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;
  const desktopItems = (): HTMLElement[] =>
    Array.from(host().querySelectorAll<HTMLElement>('.hidden.lg\\:block .roadmap-item'));
  const mobileItems = (): HTMLElement[] =>
    Array.from(host().querySelectorAll<HTMLElement>('.lg\\:hidden .roadmap-item'));

  it('keeps the entry animation on the desktop timeline, not only on mobile', () => {
    // Havia dois atributos `class` no mesmo div e o Angular fica com o último,
    // então `roadmap-item opacity-0 animate-fade-in-up` sumia sem aviso.
    const items = desktopItems();

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.classList.contains('animate-fade-in-up'))).toBeTrue();
    expect(items.every((item) => item.classList.contains('opacity-0'))).toBeTrue();
  });

  it('keeps the desktop layout classes that shared the element with the animation', () => {
    const items = desktopItems();

    expect(items.every((item) => item.classList.contains('flex'))).toBeTrue();
    expect(items.every((item) => item.classList.contains('items-center'))).toBeTrue();
    expect(items[0].classList.contains('flex-row-reverse')).toBeTrue();
    expect(items[1]?.classList.contains('flex-row')).toBeTrue();
  });

  it('gives desktop and mobile the same animation contract', () => {
    const animationClasses = (item: HTMLElement) =>
      ['roadmap-item', 'opacity-0', 'animate-fade-in-up'].filter((name) =>
        item.classList.contains(name)
      );

    expect(mobileItems().length).toBe(desktopItems().length);
    expect(animationClasses(desktopItems()[0])).toEqual(animationClasses(mobileItems()[0]));
  });

  it('staggers the entry so the delay is not dead code', () => {
    const delays = desktopItems().map((item) => item.style.animationDelay);

    expect(delays[0]).toBe('0s');
    expect(delays[1]).toBe('0.2s');
  });

  it('actually runs the animation, not just carries the class', () => {
    // A classe sozinha provaria pouco: o defeito anterior era justamente uma
    // classe que existia no código e não chegava ao elemento. Aqui o navegador
    // já resolveu o estilo, então o nome da animação e o delay são o efeito.
    const [first, second] = desktopItems().map((item) => getComputedStyle(item));

    // O nome vem prefixado porque o Angular escopa os keyframes do componente.
    expect(first.animationName).toContain('fadeInUp');
    expect(first.animationFillMode).toBe('forwards');
    expect(second.animationDelay).toBe('0.2s');
  });

  it('opens with the three most recent entries and reveals the rest on demand', () => {
    const recent = component.visibleRoadmap.length;
    expect(recent).toBe(3);

    component.toggleHistory();
    fixture.detectChanges();

    expect(component.visibleRoadmap.length).toBeGreaterThan(recent);
    expect(desktopItems().length).toBe(component.visibleRoadmap.length);
  });
});
