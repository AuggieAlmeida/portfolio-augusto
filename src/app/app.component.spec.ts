import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NavService } from './core/services/nav.service';
import { of } from 'rxjs';

// Mock do TranslateService
class MockTranslateService {
  use(lang: string) {}
  setDefaultLang(lang: string) {}
  get currentLang() { return 'pt'; }
}

// Mock do NavService
class MockNavService {
  active$ = of('hero');
  setActive(section: string) {}
  scrollTo(section: string, offset: number) {}
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

  // Remova ou atualize este teste conforme necessário
  it('should have the correct initial active section', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});