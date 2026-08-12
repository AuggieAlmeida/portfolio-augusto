import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CONTACT_EMAIL } from '../../core/contact/contact-channels';
import { ClipboardService } from '../../core/services/clipboard.service';
import { CopyEmailComponent } from './copy-email.component';

describe('CopyEmailComponent', () => {
  let fixture: ComponentFixture<CopyEmailComponent>;
  let clipboard: ClipboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyEmailComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CopyEmailComponent);
    clipboard = TestBed.inject(ClipboardService);
    fixture.detectChanges();
  });

  const host = (): HTMLElement => fixture.nativeElement as HTMLElement;

  const clickButton = () => host().querySelector<HTMLButtonElement>('[data-copy-email]')?.click();

  it('copies the same address the mailto links use', fakeAsync(() => {
    const copy = spyOn(clipboard, 'copy').and.resolveTo(true);

    clickButton();
    tick();

    expect(copy).toHaveBeenCalledWith(CONTACT_EMAIL);
  }));

  it('announces success in a live region, not only by swapping the icon', fakeAsync(() => {
    spyOn(clipboard, 'copy').and.resolveTo(true);

    clickButton();
    tick();
    fixture.detectChanges();

    const status = host().querySelector('[role="status"]')!;
    expect(status.textContent?.trim()).toBe('contact.emailCopied');
    expect(host().querySelector('.fa-check')).not.toBeNull();
  }));

  it('says so when the copy fails instead of showing the success state', fakeAsync(() => {
    spyOn(clipboard, 'copy').and.resolveTo(false);

    clickButton();
    tick();
    fixture.detectChanges();

    const status = host().querySelector('[role="status"]')!;
    expect(status.textContent?.trim()).toBe('contact.copyFailed');
    expect(host().querySelector('.fa-check')).toBeNull();
  }));

  it('returns to the resting state after the feedback window', fakeAsync(() => {
    spyOn(clipboard, 'copy').and.resolveTo(true);

    clickButton();
    tick();
    tick(2000);
    fixture.detectChanges();

    expect(host().querySelector('.fa-check')).toBeNull();
    expect(host().querySelector('.fa-copy')).not.toBeNull();
  }));

  it('is not swallowed by the card click shortcut of the projects section', () => {
    const button = host().querySelector('[data-copy-email]')!;

    expect(button.hasAttribute('data-card-control')).toBeTrue();
  });
});
