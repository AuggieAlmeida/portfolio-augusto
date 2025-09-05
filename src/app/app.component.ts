import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { NavService } from './core/services/nav.service';
import { SkillsComponent } from "./components/skills/skills.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HeroComponent, AboutComponent, SkillsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  
})
export class AppComponent {
  private nav = inject(NavService);

  ngAfterViewInit() {
    // Exemplo: abrir a seção 'projects' programaticamente (ou escutar)
    // this.nav.scrollTo('projects'); // se quiser navegar programaticamente

    this.nav.active$.subscribe(active => {
      console.log('seção ativa:', active);
      // pode atualizar UI específica ou enviar para analytics
    });
  }}