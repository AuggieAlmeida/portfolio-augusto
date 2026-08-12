import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NavService } from '../../core/services/nav.service';
import { StatusBarComponent } from './status-bar.component';

describe('StatusBarComponent', () => {
  it('shows only the current section', async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBarComponent, TranslateModule.forRoot()]
    }).compileComponents();
    const fixture = TestBed.createComponent(StatusBarComponent);
    const nav = TestBed.inject(NavService);
    const host: HTMLElement = fixture.nativeElement;

    nav.setActive('projects');
    fixture.detectChanges();

    expect(fixture.componentInstance.sectionKey).toBe('nav.projects');
    // Terminal voltou para o botão flutuante e o contato saiu: a barra não tem
    // mais controle nenhum, só o indicador.
    expect(host.querySelector('button')).toBeNull();
    expect(host.querySelector('a')).toBeNull();
  });
});
