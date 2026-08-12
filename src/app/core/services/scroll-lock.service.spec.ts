import { TestBed } from '@angular/core/testing';

import { ScrollLockService } from './scroll-lock.service';

describe('ScrollLockService', () => {
  let service: ScrollLockService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    document.body.style.overflow = '';
    service = TestBed.inject(ScrollLockService);
  });

  it('keeps scrolling locked until every overlay releases it', () => {
    service.lock('terminal');
    service.lock('project-modal');
    service.unlock('terminal');

    expect(document.body.style.overflow).toBe('hidden');

    service.unlock('project-modal');
    expect(document.body.style.overflow).toBe('');
  });
});
