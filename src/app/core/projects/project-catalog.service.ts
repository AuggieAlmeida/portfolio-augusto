import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import projectsData from '../../components/projects/projects.json';
import { resolveImage, ResponsiveImage } from '../images/responsive-image';

export interface ProjectDecision {
  contextKey: string;
  constraintKey: string;
  decisionKey: string;
  evidenceKey: string;
  impactKey: string;
}

export type { ResponsiveImage };

interface RawProject {
  id: string;
  titleKey: string;
  descriptionKey: string;
  imageKey?: string;
  imageKeys?: string[];
  category: 'commercial' | 'study';
  tagsKeys: string[];
  technologies: string[];
  featured?: boolean;
  /**
   * A imagem é ilustração conceitual, não captura do sistema. Existe para os
   * cases sob confidencialidade e para os projetos sem interface alcançável:
   * sem isso, arte gerada na capa passaria por print de tela do cliente.
   */
  illustrated?: boolean;
  demoUrl?: string;
  githubUrl?: string;
  paperUrl?: string;
  decision?: ProjectDecision;
}

export interface ProjectItem extends RawProject {
  /** Capa do cartão; `null` em case sem captura publicável. */
  cover: ResponsiveImage | null;
  /** Galeria do modal: `imageKeys` quando existe, senão a própria capa. */
  gallery: ResponsiveImage[];
  /** Só as tecnologias que cabem no cartão, mais o resto contado. */
  visibleTechnologies: string[];
  hiddenTechnologies: number;
}

interface ProjectsData {
  commercial: RawProject[];
  study: RawProject[];
}

const CARD_TECHNOLOGIES = 4;

function hydrate(raw: RawProject): ProjectItem {
  const cover = resolveImage(raw.imageKey);
  const gallery = raw.imageKeys?.length
    ? raw.imageKeys.map(resolveImage).filter((image): image is ResponsiveImage => image !== null)
    : cover
      ? [cover]
      : [];

  return {
    ...raw,
    cover,
    gallery,
    visibleTechnologies: raw.technologies.slice(0, CARD_TECHNOLOGIES),
    hiddenTechnologies: Math.max(0, raw.technologies.length - CARD_TECHNOLOGIES)
  };
}

/** Fonte única dos projetos para cards, terminal e quick open. */
@Injectable({ providedIn: 'root' })
export class ProjectCatalogService {
  readonly commercial = ((projectsData as ProjectsData).commercial || []).map(hydrate);
  readonly study = ((projectsData as ProjectsData).study || []).map(hydrate);
  readonly all = [...this.commercial, ...this.study];
  /** Recorte curto da seção de projetos; o inventário fica atrás de "ver todos". */
  readonly featured = this.all.filter((project) => project.featured);

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
