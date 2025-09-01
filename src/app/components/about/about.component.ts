import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  template: `
    <section class="relative py-20 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-primary-950 dark:via-secondary-950 dark:to-accent-950 overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%236366f1&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-100/20 via-transparent to-secondary-100/20 dark:from-primary-800/20 dark:to-secondary-800/20 animate-pulse-slow"></div>

      <div class="relative z-10 container mx-auto px-6">
        <h2 class="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-10">
          <span class="font-display text-primary-600 dark:text-primary-400">✦</span> {{ 'about.aboutMe' | translate }}
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-10 items-stretch">
          <!-- Left: Image panel -->
          <div class="relative rounded-2xl overflow-hidden shadow-2xl bg-white/70 dark:bg-neutral-900/60 border border-primary-100 dark:border-primary-800">
            <div class="absolute inset-0 rounded-2xl bg-primary-400/10 dark:bg-primary-600/10 blur-2xl"></div>
            <img
              src="assets/images/about/about.jpg"
              alt="Foto - Augusto Almeida"
              class="relative w-full h-full object-cover min-h-[320px]"
              loading="lazy"
            />
          </div>

          <!-- Right: Text panel -->
          <div class="rounded-2xl col-span-3 p-8 md:p-10 bg-white dark:bg-neutral-900 shadow-xl border border-primary-100 dark:border-primary-800">
            <h3 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 font-heading">
              Augusto Almeida
            </h3>
            <p class="text-neutral-600 dark:text-neutral-300 mb-6">
              {{ 'about.description' | translate }}
            </p>

            <div class="space-y-6">
              <div>
                <h4 class="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-2 font-heading">
                  ✦ {{ 'about.goalsTitle' | translate }}
                </h4>
                <p class="text-neutral-600 dark:text-neutral-300">
                  {{ 'about.goalsDescription' | translate }}
                </p>
              </div>

              <div>
                <h4 class="text-xl font-semibold text-secondary-600 dark:text-secondary-400 mb-2 font-heading">
                  ✦ {{ 'about.professionalTrajectory' | translate }}
                </h4>
                <ul class="list-disc pl-5 text-neutral-600 dark:text-neutral-300 space-y-2">
                  <li>{{ 'about.engineerOfTests' | translate }} – Outlier (2025)</li>
                  <li>{{ 'about.frontendDeveloper' | translate }} – Make Acelerador de Vendas (2024)</li>
                  <li>{{ 'about.fullstackDeveloper' | translate }} – Autônomo (2022–2024)</li>
                  <li>
                    {{ 'about.internships' | translate }}
                    <ul class="list-[disclosure-closed] pl-5 mt-1 space-y-1">
                      <li>{{ 'about.internshipSintel' | translate }}, BPO/BPM - Sintel (2021–2022)</li>
                      <li>{{ 'about.internshipItau' | translate }}, BI – Itaú Unibanco SA (2020-2021)</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-xl font-semibold text-accent-600 dark:text-accent-400 mb-2 font-heading">
                  ✦ {{ 'about.academicFormation' | translate }}
                </h4>
                <ul class="list-disc pl-5 text-neutral-600 dark:text-neutral-300 space-y-2">
                  <li>{{ 'about.multiplatformSoftwareDeveloper' | translate }} – Fatec Mauá (2024 – em andamento)</li>
                  <li>{{ 'about.systemsAnalysisAndDevelopment' | translate }} – Fatec SCS (2020 – 2023)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
standalone:true,
    imports: [CommonModule, TranslateModule]
})

export class AboutComponent {}