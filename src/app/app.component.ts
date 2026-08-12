import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AboutComponent } from './components/about/about.component';
import { CareerRoadmapComponent } from './components/carrer/carrer.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    CareerRoadmapComponent,
    ProjectsComponent,
    SkillsComponent,
    FooterComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent {}
