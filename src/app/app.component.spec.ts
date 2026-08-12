import { DeferBlockState, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, TranslateModule.forRoot()]
    }).compileComponents();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('keeps a permanent anchor for every deferred section', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;

    // Sem as âncoras, a navegação do header, o terminal e o quick open ficariam
    // sem alvo enquanto a seção não hidrata.
    for (const id of ['career-anchor', 'projects-anchor', 'skills-anchor']) {
      expect(host.querySelector(`#${id}`))
        .withContext(id)
        .not.toBeNull();
    }

    expect(host.querySelector('app-career')).toBeNull();
    expect(host.querySelectorAll('.section-placeholder').length).toBe(3);
  });

  it('renders every landing section in order once the deferred blocks resolve', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    for (const block of await fixture.getDeferBlocks()) {
      await block.render(DeferBlockState.Complete);
    }
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const sections = Array.from(host.querySelectorAll('main > *'))
      .map((element) => element.tagName.toLowerCase())
      .filter((tag) => tag.startsWith('app-'));

    expect(sections).toEqual([
      'app-hero',
      'app-about',
      'app-career',
      'app-projects',
      'app-skills',
      'app-footer'
    ]);
  });
});
