import { firstValueFrom } from 'rxjs';

import { BundledTranslateLoader } from './bundled-translate.loader';

describe('BundledTranslateLoader', () => {
  const loader = new BundledTranslateLoader();

  // As chaves que o visitante viu cruas na tela quando o `pt.json` velho ficou
  // preso em cache. Se alguma sair do dicionário, o gate acusa antes do deploy.
  const REGRESSION_KEYS = [
    ['CTA', 'viewFeatured'],
    ['CTA', 'downloadCv'],
    ['projects', 'redirect'],
    ['projects', 'all', 'show'],
    ['skills', 'practice', 'title'],
    ['roadmap', 'history', 'show']
  ];

  const read = (dictionary: unknown, path: string[]): unknown =>
    path.reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      dictionary
    );

  it('resolves every locale without a network request for assets/i18n', async () => {
    for (const locale of ['pt', 'en']) {
      const dictionary = await firstValueFrom(loader.getTranslation(locale));

      expect(Object.keys(dictionary).length).toBeGreaterThan(0);
      for (const path of REGRESSION_KEYS) {
        expect(read(dictionary, path))
          .withContext(`${locale}: ${path.join('.')}`)
          .toEqual(jasmine.any(String));
      }
    }
  });

  it('falls back to the default locale instead of resolving an empty dictionary', async () => {
    const dictionary = await firstValueFrom(loader.getTranslation('tlh'));

    expect(read(dictionary, ['CTA', 'viewFeatured'])).toBe('Ver cases em destaque');
  });
});
