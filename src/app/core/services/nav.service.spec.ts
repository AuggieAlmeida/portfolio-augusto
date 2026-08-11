import { TestBed } from '@angular/core/testing';

import { NavService } from './nav.service';

describe('NavService', () => {
  let service: NavService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    service = TestBed.inject(NavService);
  });

  it('starts on the hero section', (done) => {
    service.active$.subscribe((section) => {
      expect(section).toBe('hero');
      done();
    });
  });

  it('emits the section set by setActive', () => {
    const seen: string[] = [];
    service.active$.subscribe((section) => seen.push(section));

    service.setActive('projects');

    expect(seen).toEqual(['hero', 'projects']);
  });

  it('leaves the active section untouched when the target element is missing', () => {
    const scrollTo = spyOn(window, 'scrollTo');

    service.scrollTo('does-not-exist');

    expect(scrollTo).not.toHaveBeenCalled();
    expect(service).toBeTruthy();
  });

  it('scrolls to an existing element and marks it active', () => {
    const scrollTo = spyOn(window, 'scrollTo');
    const target = document.createElement('div');
    target.id = 'about';
    document.body.appendChild(target);

    const seen: string[] = [];
    service.active$.subscribe((section) => seen.push(section));

    service.scrollTo('about', 10);

    expect(scrollTo).toHaveBeenCalled();
    expect(seen.at(-1)).toBe('about');

    target.remove();
  });
});
