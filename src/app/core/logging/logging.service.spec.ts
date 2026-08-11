import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { LoggingService } from './logging.service';

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    service = TestBed.inject(LoggingService);
  });

  it('emits messages at or above the configured level', () => {
    const spy = spyOn(console, 'error');

    service.error('boom', { id: 1 });

    expect(spy).toHaveBeenCalledWith('boom', { id: 1 });
  });

  it('drops messages below the configured level', () => {
    const spy = spyOn(console, 'debug');

    service.debug('noise');

    // The dev environment logs at `debug`, so this only proves the gate when
    // the threshold is higher — assert against the actual configured level.
    expect(spy.calls.any()).toBe(environment.logLevel === 'debug');
  });
});
