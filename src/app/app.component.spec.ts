import { TestBed } from '@angular/core/testing';
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

  it('renders every landing section in order', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const sections = Array.from(host.querySelectorAll('main > *')).map((el) =>
      el.tagName.toLowerCase()
    );

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
