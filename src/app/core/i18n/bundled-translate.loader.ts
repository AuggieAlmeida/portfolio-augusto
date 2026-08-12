import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';

import { DEFAULT_LOCALE, isLocale, Locale } from './locales';

/**
 * Carrega os dicionários por `import()` em vez de buscar `assets/i18n/*.json`
 * por HTTP.
 *
 * O motivo é um bug que chegou ao visitante: enquanto `/assets/*` respondia com
 * cache imutável, os navegadores guardaram uma cópia antiga de `pt.json` e
 * pararam de revalidar. Quem tinha essa cópia passou a ver a chave crua na tela
 * — `CTA.viewFeatured`, `projects.redirect`, `skills.practice.*` — porque o
 * dicionário em cache não conhecia as chaves novas. O header já foi corrigido,
 * mas cache velho não se conserta pelo servidor: só deixa de ser usado quando o
 * arquivo deixa de ser buscado por uma URL estável.
 *
 * Como chunk gerado pelo build, o dicionário passa a ter hash de conteúdo no
 * nome. Cópia velha nunca é reutilizada, e só o idioma em uso é baixado.
 */
const DICTIONARIES: Record<Locale, () => Promise<TranslationObject>> = {
  pt: () =>
    import('../../../assets/i18n/pt.json').then((module) => module.default as TranslationObject),
  en: () =>
    import('../../../assets/i18n/en.json').then((module) => module.default as TranslationObject)
};

export class BundledTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
    return from(DICTIONARIES[locale]());
  }
}
