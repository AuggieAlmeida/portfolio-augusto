import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let fixture: ComponentFixture<ProjectsComponent>;
  let component: ProjectsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('opens with a short featured cut instead of the whole inventory', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(component.featuredProjects.length).toBeGreaterThanOrEqual(4);
    expect(component.featuredProjects.length).toBeLessThanOrEqual(6);
    expect(host.querySelectorAll('[data-project-card]').length).toBe(
      component.featuredProjects.length
    );
    expect(host.querySelector('#projects-inventory')).toBeNull();
  });

  it('reveals the full inventory only behind the see-all control', () => {
    const host: HTMLElement = fixture.nativeElement;
    const toggle = host.querySelector<HTMLButtonElement>('[aria-controls="projects-inventory"]');

    expect(toggle?.getAttribute('aria-expanded')).toBe('false');

    toggle?.click();
    fixture.detectChanges();

    expect(toggle?.getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelector('#projects-inventory')).not.toBeNull();
    // Cada projeto aparece no inventário; os do destaque aparecem duas vezes.
    expect(host.querySelectorAll('[data-project-card]').length).toBe(
      component.commercialProjects.length +
        component.studyProjects.length +
        component.featuredProjects.length
    );
  });

  it('renders one explicit details button for each project card', () => {
    const host: HTMLElement = fixture.nativeElement;
    const buttons = host.querySelectorAll<HTMLButtonElement>('[data-card-details]');

    expect(buttons.length).toBe(component.featuredProjects.length);
    expect(Array.from(buttons).every((button) => button.querySelector('.fa-eye'))).toBeTrue();
  });

  it('opens the modal once when the explicit details button is clicked', () => {
    const openModal = spyOn(component, 'openProjectModal').and.callThrough();
    const host: HTMLElement = fixture.nativeElement;
    const button = host.querySelector<HTMLButtonElement>('[data-card-details]');

    button?.click();

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(component.selectedProject).toBe(component.featuredProjects[0]);
  });

  it('keeps the whole card clickable without making it a nested button', () => {
    const host: HTMLElement = fixture.nativeElement;
    const card = host.querySelector<HTMLElement>('[data-project-card] .project-card-inner');

    card?.click();

    expect(component.selectedProject).toBe(component.featuredProjects[0]);
    expect(host.querySelector('[data-project-card][role="button"]')).toBeNull();
  });

  it('serves cards through responsive derivatives instead of the master file', () => {
    const host: HTMLElement = fixture.nativeElement;
    const picture = host.querySelector('picture');
    const withCover = component.featuredProjects.find((project) => project.cover);

    expect(withCover).toBeDefined();
    expect(picture?.querySelector('source[type="image/avif"]')?.getAttribute('srcset')).toContain(
      '.avif '
    );
    expect(picture?.querySelector('source[type="image/webp"]')?.getAttribute('srcset')).toContain(
      '.webp '
    );
    expect(picture?.querySelector('img')?.getAttribute('loading')).toBe('lazy');
    expect(picture?.querySelector('img')?.getAttribute('width')).toBeTruthy();
  });

  it('restores focus to the initiating control when the modal closes', fakeAsync(() => {
    const host: HTMLElement = fixture.nativeElement;
    const button = host.querySelector<HTMLButtonElement>('[data-card-control]');
    button?.focus();

    component.openProjectModal(component.commercialProjects[0]);
    fixture.detectChanges();
    tick();
    component.closeModal();
    tick();

    expect(document.activeElement).toBe(button);
  }));

  it('makes every background region inert while the project modal is open', () => {
    const header = document.createElement('app-header');
    const commandCenter = document.createElement('app-command-center');
    const main = document.createElement('main');
    const hero = document.createElement('app-hero');
    document.body.append(header, commandCenter, main);
    main.append(hero, fixture.nativeElement);

    component.openProjectModal(component.commercialProjects[0]);
    fixture.detectChanges();

    expect(header.hasAttribute('inert')).toBeTrue();
    expect(hero.hasAttribute('inert')).toBeTrue();
    expect(fixture.nativeElement.querySelector('section')?.hasAttribute('inert')).toBeTrue();

    component.closeModal();

    expect(header.hasAttribute('inert')).toBeFalse();
    expect(hero.hasAttribute('inert')).toBeFalse();
    expect(fixture.nativeElement.querySelector('section')?.hasAttribute('inert')).toBeFalse();
    header.remove();
    commandCenter.remove();
    main.remove();
  });

  it('scrolls carousels by the measured card width instead of a desktop constant', () => {
    const carousel = document.createElement('div');
    const rail = document.createElement('div');
    const card = document.createElement('article');
    card.dataset['projectCard'] = 'example';
    rail.style.display = 'flex';
    rail.style.gap = '16px';
    rail.append(card);
    carousel.append(rail);
    document.body.append(carousel);
    spyOn(card, 'getBoundingClientRect').and.returnValue({ width: 280 } as DOMRect);
    const scrollTo = spyOn(carousel, 'scrollTo');
    component.commercialCarousel = { nativeElement: carousel };

    component.scrollCarousel('commercial', 'right');

    expect(scrollTo).toHaveBeenCalled();
    const options = scrollTo.calls.mostRecent().args[0] as ScrollToOptions;
    expect(options.left).toBe(296);
    expect(typeof options.behavior).toBe('string');
    carousel.remove();
  });

  it('renders Redirect as primary and GitHub as secondary when both links exist', () => {
    const project = [...component.commercialProjects, ...component.studyProjects].find(
      (item) => item.demoUrl && item.githubUrl
    );
    expect(project).toBeDefined();

    component.openProjectModal(project!);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const redirect = host.querySelector<HTMLButtonElement>('[data-modal-action="redirect"]');
    const github = host.querySelector<HTMLButtonElement>('[data-modal-action="github"]');

    expect(redirect?.textContent).toContain('projects.redirect');
    expect(redirect?.classList).toContain('bg-primary-500');
    expect(github?.textContent).toContain('projects.viewCode');
    expect(github?.classList).toContain('border');
  });

  it('hides every external action when the project has no public link', () => {
    const confidentialProject = [...component.commercialProjects, ...component.studyProjects].find(
      (item) => !item.demoUrl && !item.githubUrl && !item.paperUrl
    );
    expect(confidentialProject).toBeDefined();

    component.openProjectModal(confidentialProject!);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelectorAll('[data-modal-action]').length).toBe(0);
  });

  it('shows the decision case only when the catalog has verified decision data', () => {
    const project = component.commercialProjects.find((item) => item.decision);
    expect(project).toBeDefined();

    component.openProjectModal(project!);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelector('[data-decision-toggle]')).not.toBeNull();
    expect(host.querySelector('#decision-details')).toBeNull();

    component.toggleDecisionDetails();
    fixture.detectChanges();

    expect(host.querySelector('#decision-details')?.textContent).toContain(
      'projects.decisions.payroll.context'
    );
  });

  it('opens external links in a separate tab without an opener reference', () => {
    const open = spyOn(window, 'open');

    component.openUrl('https://example.com');

    expect(open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });
});
