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
});
