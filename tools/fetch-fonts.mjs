#!/usr/bin/env node
/**
 * Baixa as famílias do Google Fonts uma única vez e as versiona em
 * `src/assets/fonts/`, junto com o `fonts.css` gerado.
 *
 * Motivo: o `<link>` para fonts.googleapis.com era um recurso de terceiro no
 * caminho crítico — DNS, TLS e uma folha de estilo bloqueante antes de qualquer
 * glifo aparecer. Servindo do mesmo domínio, o CSP fecha em `'self'` e o
 * navegador reaproveita a conexão que já abriu para o HTML.
 *
 * Rodar sob demanda (`node tools/fetch-fonts.mjs`), não no build: a saída é
 * versionada e o build de produção não pode depender de rede.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// Fora de `src/assets/` de propósito: a folha entra no bundle de estilos pelo
// angular.json, e o builder emite os woff2 com hash. Em assets, os arquivos
// seriam copiados uma segunda vez, sem hash.
const OUT_DIR = join(ROOT, 'src/styles/fonts');

// Variável onde o Google oferece variável: um arquivo cobre 400/500/600/700 e
// dispensa três downloads por família.
const FAMILIES = [
  { name: 'Open Sans', spec: 'Open+Sans:wght@400..700' },
  { name: 'Montserrat', spec: 'Montserrat:wght@500..700' },
  { name: 'JetBrains Mono', spec: 'JetBrains+Mono:wght@400..600' },
  // Great Vibes só escreve "Almeida" no herói; o alfabeto inteiro custaria
  // 76 kB para sete letras.
  { name: 'Great Vibes', spec: 'Great+Vibes', text: 'Almeida' }
];

// Só os subsets que o site realmente escreve. `latin-ext` cobre o português
// acentuado que o `latin` não traz.
const KEEP_SUBSETS = new Set(['latin', 'latin-ext']);

// Sem UA de navegador moderno o Google devolve `truetype`, que pesa o dobro.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function fetchCss(spec, text) {
  const query = text ? `&text=${encodeURIComponent(text)}` : '';
  const url = `https://fonts.googleapis.com/css2?family=${spec}${query}&display=swap`;
  const response = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!response.ok) throw new Error(`${url} respondeu ${response.status}`);
  return response.text();
}

/** Quebra a folha do Google em blocos `@font-face` com os campos que importam.
 *  Com `text=`, o Google devolve um bloco só e sem o comentário de subset. */
function parseFaces(css) {
  const faces = [];
  const blocks = css.matchAll(/(?:\/\*\s*([a-z-]+)\s*\*\/\s*)?@font-face\s*{([^}]+)}/g);
  for (const [, rawSubset, body] of blocks) {
    const subset = rawSubset ?? 'subset';
    const pick = (field) => body.match(new RegExp(`${field}:\\s*([^;]+);`))?.[1]?.trim();
    // A URL de subset (`/l/font?kit=…`) não termina em `.woff2`; o formato só
    // aparece no `format('woff2')` logo depois.
    const src = body.match(/url\((https:[^)]+)\)\s*format\('woff2'\)/)?.[1];
    if (!src) continue;
    faces.push({
      subset,
      family: pick('font-family')?.replace(/['"]/g, ''),
      style: pick('font-style') ?? 'normal',
      weight: pick('font-weight') ?? '400',
      unicodeRange: pick('unicode-range'),
      src
    });
  }
  return faces;
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const rules = [];
  for (const family of FAMILIES) {
    const faces = parseFaces(await fetchCss(family.spec, family.text)).filter(
      (face) => family.text || KEEP_SUBSETS.has(face.subset)
    );
    if (!faces.length) throw new Error(`nenhum @font-face utilizável para ${family.name}`);

    for (const face of faces) {
      const file = `${slug(family.name)}-${face.subset}-${slug(face.weight)}.woff2`;
      const binary = await fetch(face.src, { headers: { 'User-Agent': UA } });
      if (!binary.ok) throw new Error(`${face.src} respondeu ${binary.status}`);
      await writeFile(join(OUT_DIR, file), Buffer.from(await binary.arrayBuffer()));

      rules.push(
        [
          '@font-face {',
          `  font-family: '${face.family}';`,
          `  font-style: ${face.style};`,
          `  font-weight: ${face.weight};`,
          '  font-display: swap;',
          `  src: url('./${file}') format('woff2');`,
          face.unicodeRange ? `  unicode-range: ${face.unicodeRange};` : null,
          '}'
        ]
          .filter(Boolean)
          .join('\n')
      );
    }
  }

  const header = [
    '/* Gerado por tools/fetch-fonts.mjs — não editar à mão. */',
    '/* Fontes self-hosted: tiram fonts.googleapis.com do caminho crítico e',
    "   permitem CSP com font-src 'self'. */",
    ''
  ].join('\n');

  await writeFile(join(OUT_DIR, 'fonts.css'), `${header}${rules.join('\n\n')}\n`);

  const written = await readdir(OUT_DIR);
  console.log(`fontes: ${written.length - 1} arquivo(s) woff2 + fonts.css em src/styles/fonts`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
