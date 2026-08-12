import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CommandCenterComponent } from './command-center.component';

describe('CommandCenterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandCenterComponent, TranslateModule.forRoot()]
    }).compileComponents();
  });

  it('runs reboot in an optional overlay and lets the visitor skip it', fakeAsync(() => {
    const main = document.createElement('main');
    document.body.appendChild(main);
    const fixture = TestBed.createComponent(CommandCenterComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.open('terminal');
    component.input = 'reboot';
    component.submit(new Event('submit') as SubmitEvent);
    fixture.detectChanges();

    expect(component.surface).toBe('boot');
    // O primeiro botão do host é o launcher flutuante; o de pular vive no overlay.
    expect(fixture.nativeElement.querySelector('[role="dialog"] button')?.textContent).toContain(
      'Pular animação'
    );
    expect(main.hasAttribute('inert')).toBeTrue();

    component.skipBoot();
    tick();

    expect(component.surface).toBeNull();
    expect(main.hasAttribute('inert')).toBeFalse();
    main.remove();
  }));

  it('keeps the terminal launcher floating in the page corner', () => {
    const fixture = TestBed.createComponent(CommandCenterComponent);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const launcher = host.querySelector<HTMLButtonElement>('[data-terminal-launcher]');

    expect(launcher).not.toBeNull();
    expect(launcher?.className).toContain('fixed');
    expect(launcher?.className).toContain('right-4');

    launcher?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.surface).toBe('terminal');
  });
});
