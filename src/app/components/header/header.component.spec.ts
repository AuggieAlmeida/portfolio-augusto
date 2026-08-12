import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let main: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, TranslateModule.forRoot()]
    }).compileComponents();

    main = document.createElement('main');
    document.body.append(main);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => main.remove());

  it('only renders the mobile drawer while open and makes the page inert', fakeAsync(() => {
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();

    component.toggleMobileMenu();
    fixture.detectChanges();
    tick();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();
    expect(main.hasAttribute('inert')).toBeTrue();

    component.closeMobileMenu();
    fixture.detectChanges();
    tick();

    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
    expect(main.hasAttribute('inert')).toBeFalse();
  }));
});
