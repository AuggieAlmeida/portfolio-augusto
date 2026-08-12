import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NavService } from '../../core/services/nav.service';
import { StatusBarComponent } from './status-bar.component';

describe('StatusBarComponent', () => {
  it('reflects the current section and exposes a real contact action', async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBarComponent, TranslateModule.forRoot()]
    }).compileComponents();
    const fixture = TestBed.createComponent(StatusBarComponent);
    const nav = TestBed.inject(NavService);
    const host: HTMLElement = fixture.nativeElement;

    nav.setActive('projects');
    fixture.detectChanges();

    expect(fixture.componentInstance.sectionKey).toBe('nav.projects');
    expect(host.querySelector<HTMLAnchorElement>('a[href^="mailto:"]')?.href).toContain(
      'augusto.almeida2@icloud.com'
    );
  });
});
