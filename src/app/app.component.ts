import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AboutComponent } from './components/about/about.component';
import { CareerRoadmapComponent } from './components/carrer/carrer.component';
import { CommandCenterComponent } from './components/command-center/command-center.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    CommandCenterComponent,
    HeroComponent,
    AboutComponent,
    CareerRoadmapComponent,
    ProjectsComponent,
    SkillsComponent,
    FooterComponent,
    StatusBarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent {}
