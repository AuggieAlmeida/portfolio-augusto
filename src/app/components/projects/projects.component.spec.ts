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

  it('renders one explicit details button for each project card', () => {
    const host: HTMLElement = fixture.nativeElement;
    const buttons = host.querySelectorAll<HTMLButtonElement>('[data-card-control]');

    expect(buttons.length).toBe(
      component.commercialProjects.length + component.studyProjects.length
    );
    expect(Array.from(buttons).every((button) => button.querySelector('.fa-eye'))).toBeTrue();
  });

  it('opens the modal once when the explicit details button is clicked', () => {
    const openModal = spyOn(component, 'openProjectModal').and.callThrough();
    const host: HTMLElement = fixture.nativeElement;
    const button = host.querySelector<HTMLButtonElement>('[data-card-control]');

    button?.click();

    expect(openModal).toHaveBeenCalledTimes(1);
    expect(component.selectedProject).toBe(component.commercialProjects[0]);
  });

  it('keeps the whole card clickable without making it a nested button', () => {
    const host: HTMLElement = fixture.nativeElement;
    const card = host.querySelector<HTMLElement>('[data-project-card] .project-card-inner');

    card?.click();

    expect(component.selectedProject).toBe(component.commercialProjects[0]);
    expect(host.querySelector('[data-project-card][role="button"]')).toBeNull();
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

  it('opens external links in a separate tab without an opener reference', () => {
    const open = spyOn(window, 'open');

    component.openUrl('https://example.com');

    expect(open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
  });
});
