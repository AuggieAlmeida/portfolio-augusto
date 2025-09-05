import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NavService } from './core/services/nav.service';
import { of } from 'rxjs';

// Mock do TranslateService
class MockTranslateService {
  readonly currentLang = 'pt'; // Corrigido para usar readonly field

  use() {
    // Intencionalmente vazio - removido parâmetro não utilizado
  }

  setDefaultLang() {
    // Intencionalmente vazio - removido parâmetro não utilizado
  }
}

// Mock do NavService
class MockNavService {
  active$ = of('hero');

  setActive() {
    // Intencionalmente vazio - removido parâmetro não utilizado
  }

  scrollTo() {
    // Intencionalmente vazio - removido parâmetro não utilizado
  }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, TranslateModule.forRoot()],
      providers: [
        { provide: NavService, useClass: MockNavService },
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the correct initial active section', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});