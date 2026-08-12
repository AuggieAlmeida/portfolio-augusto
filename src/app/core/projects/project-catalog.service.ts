import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import projectsData from '../../components/projects/projects.json';

export interface ProjectItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  images?: string[];
  category: 'commercial' | 'study';
  tagsKeys: string[];
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  paperUrl?: string;
}

interface ProjectsData {
  commercial: ProjectItem[];
  study: ProjectItem[];
}

/** Fonte única dos projetos para cards, terminal e quick open. */
@Injectable({ providedIn: 'root' })
export class ProjectCatalogService {
  readonly commercial = (projectsData as ProjectsData).commercial || [];
  readonly study = (projectsData as ProjectsData).study || [];
  readonly all = [...this.commercial, ...this.study];

  find(slug: string): ProjectItem | undefined {
    return this.all.find((project) => project.id === slug);
  }

  search(query: string, translate: TranslateService): ProjectItem[] {
    const normalized = this.normalize(query);
    if (!normalized) return this.all;

    return this.all.filter((project) => {
      const searchable = [
        project.id,
        translate.instant(project.titleKey),
        translate.instant(project.descriptionKey),
        ...project.technologies,
        ...project.tagsKeys.map((key) => translate.instant(key))
      ]
        .map((value) => this.normalize(value))
        .join(' ');

      return normalized.split(' ').every((term) => searchable.includes(term));
    });
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase()
      .trim();
  }
}
