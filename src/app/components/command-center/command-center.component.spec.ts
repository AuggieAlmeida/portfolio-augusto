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
    expect(fixture.nativeElement.querySelector('button')?.textContent).toContain('Pular animação');
    expect(main.hasAttribute('inert')).toBeTrue();

    component.skipBoot();
    tick();

    expect(component.surface).toBeNull();
    expect(main.hasAttribute('inert')).toBeFalse();
    main.remove();
  }));
});
