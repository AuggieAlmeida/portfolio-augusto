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
    const project = component.commercialProjects.find(
      (item) => item.id === 'portal-remuneracao-frota'
    );
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

  it('gives every project a case, and shows the proof line without a click', () => {
    const all = [...component.commercialProjects, ...component.studyProjects];
    const withoutCase = all.filter((item) => !item.decision?.provesKey).map((item) => item.id);

    expect(withoutCase).toEqual([]);

    component.openProjectModal(all[0]);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelector('[data-decision-proves]')?.textContent).toContain(
      all[0].decision!.provesKey
    );
    // A prova aparece antes do toggle; o detalhe é que fica fechado.
    expect(host.querySelector('#decision-details')).toBeNull();
  });

  it('hides the details toggle when the case has nothing but the proof line', () => {
    const provesOnly = {
      ...component.studyProjects[0],
      decision: { provesKey: 'projects.decisions.example.proves' }
    };

    expect(component.hasDecisionDetails(provesOnly)).toBeFalse();

    component.openProjectModal(provesOnly);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelector('[data-decision-proves]')).not.toBeNull();
    expect(host.querySelector('[data-decision-toggle]')).toBeNull();
  });

  it('lists the stack once, and not again inside the open decision case', () => {
    const project = component.commercialProjects.find(
      (item) => item.id === 'portal-remuneracao-frota'
    )!;

    component.openProjectModal(project);
    component.toggleDecisionDetails();
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelectorAll('[data-modal-stack]').length).toBe(1);
    expect(host.querySelector('#decision-details')?.textContent).not.toContain(
      project.technologies[0]
    );
  });

  it('flags a self-reported figure inside the case instead of presenting it as measured', () => {
    const all = [...component.commercialProjects, ...component.studyProjects];
    const selfReported = all.find((item) => item.decision?.selfReported);
    const measured = all.find((item) => item.decision?.impactKey && !item.decision.selfReported);
    expect(selfReported).toBeDefined();
    expect(measured).toBeDefined();

    component.openProjectModal(selfReported!);
    component.toggleDecisionDetails();
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;

    expect(host.querySelector('[data-decision-self-reported]')).not.toBeNull();

    component.closeModal();
    component.openProjectModal(measured!);
    component.toggleDecisionDetails();
    fixture.detectChanges();

    expect(host.querySelector('[data-decision-self-reported]')).toBeNull();
  });

  it('marks illustrated covers as illustration, in the badge and in the alt text', () => {
    const illustrated = component.featuredProjects.find((item) => item.illustrated);
    expect(illustrated).toBeDefined();

    const host: HTMLElement = fixture.nativeElement;
    const alts = Array.from(host.querySelectorAll('picture img')).map((img) =>
      img.getAttribute('alt')
    );

    expect(alts).toContain(`${illustrated!.titleKey} — projects.illustrated.alt`);
    expect(host.textContent).toContain('projects.illustrated.badge');
  });

  it('never labels a real screenshot as an illustration', () => {
    const captured = component.featuredProjects.find((item) => item.cover && !item.illustrated);
    expect(captured).toBeDefined();
    expect(component.imageAlt(captured!)).toBe(captured!.titleKey);
  });

  it('gives every catalog entry a cover, so no card falls back to initials', () => {
    const all = [...component.commercialProjects, ...component.studyProjects];
    const withoutCover = all.filter((item) => !item.cover).map((item) => item.id);

    expect(withoutCover).toEqual([]);
  });

  it('opens external links in a separate tab without an opener reference', () => {
    const open = spyOn(window, 'open');

    component.openUrl('https://example.com');

    expect(open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });
});
