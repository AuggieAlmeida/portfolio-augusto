import { Component, inject, AfterViewInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { NavService } from './core/services/nav.service';
import { CareerRoadmapComponent } from "./components/carrer/carrer.component";
import { ProjectsComponent } from "./components/projects/projects.component";
import { SkillsComponent } from "./components/skills/skills.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HeroComponent, AboutComponent, CareerRoadmapComponent, SkillsComponent, ProjectsComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  
})
export class AppComponent implements AfterViewInit {
  private nav = inject(NavService);

  ngAfterViewInit() {


    this.nav.active$.subscribe(active => {
      console.log('seção ativa:', active);
    });
  }}