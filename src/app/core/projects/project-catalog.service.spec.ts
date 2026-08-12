import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ProjectCatalogService } from './project-catalog.service';

describe('ProjectCatalogService', () => {
  let service: ProjectCatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot()] });
    service = TestBed.inject(ProjectCatalogService);
  });

  describe('topTechnologies', () => {
    it('respects the limit asked for', () => {
      expect(service.topTechnologies(5).length).toBe(5);
    });

    it('orders by how many projects use the technology', () => {
      const [first, second] = service.topTechnologies(2);
      const uses = (technology: string) =>
        service.all.filter((project) =>
          project.technologies.some((tech) => tech.toLowerCase() === technology.toLowerCase())
        ).length;

      expect(uses(first)).toBeGreaterThanOrEqual(uses(second));
    });

    it('never repeats a technology that differs only in casing', () => {
      const normalized = service.topTechnologies(20).map((tech) => tech.toLowerCase());

      expect(new Set(normalized).size).toBe(normalized.length);
    });

    it('only offers filters that match at least one project', () => {
      const matches = service
        .topTechnologies(12)
        .every((technology) =>
          service.all.some((project) =>
            project.technologies.some((tech) => tech.toLowerCase() === technology.toLowerCase())
          )
        );

      expect(matches).toBeTrue();
    });
  });
});
