#!/usr/bin/env node
/**
 * Gera `src/assets/icons/icons.css` com exatamente os ícones que o código usa,
 * embutidos como `mask-image` em data URI.
 *
 * Motivo: o site carregava o kit JavaScript do Font Awesome de um domínio de
 * terceiro — script bloqueante, fontes extras e três origens a mais no CSP,
 * para desenhar menos de cem glifos. A marcação `<i class="fas fa-x">` continua
 * idêntica; muda só quem pinta.
 *
 * A máscara usa o canal alfa do SVG, então `background-color: currentColor`
 * mantém o comportamento de herdar a cor do texto.
 *
 * Rodar sob demanda (`node tools/build-icon-css.mjs`) sempre que um ícone novo
 * entrar no código. A saída é versionada.
 */
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = join(ROOT, 'src');
// Fora de `src/assets/`: a folha entra no bundle de estilos pelo angular.json.
const OUT_DIR = join(ROOT, 'src/styles');
const FA_DIR = join(ROOT, 'node_modules/@fortawesome/fontawesome-free/svgs');

const STYLE_DIRS = { fas: 'solid', far: 'regular', fab: 'brands' };
const SCANNED = new Set(['.ts', '.html', '.json', '.css']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (SCANNED.has(extname(entry.name))) yield full;
  }
}

/**
 * Coleta os ícones usados. Duas formas contam: `fas fa-user` escrito junto e
 * `[class.fa-user]`, que o template liga condicionalmente e não traz o estilo
 * ao lado — foi assim que `fa-dollar-sign` ficou de fora e o badge do cartão
 * virou um quadrado sólido.
 */
async function collectIcons() {
  const found = new Map();
  for await (const file of walk(SRC_DIR)) {
    const content = await readFile(file, 'utf8');
    for (const [, style, name] of content.matchAll(/\b(fas|far|fab) fa-([a-z0-9-]+)/g)) {
      found.set(name, { style, name });
    }
    for (const [, name] of content.matchAll(/\[class\.fa-([a-z0-9-]+)\]/g)) {
      if (!found.has(name)) found.set(name, { style: null, name });
    }
  }
  return [...found.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Sem estilo declarado, procura o SVG nos três conjuntos, na ordem de uso. */
async function readSvg(style, name) {
  const styles = style ? [style] : ['fas', 'far', 'fab'];
  for (const candidate of styles) {
    const svg = await readFile(join(FA_DIR, STYLE_DIRS[candidate], `${name}.svg`), 'utf8').catch(
      () => null
    );
    if (svg) return svg;
  }
  return null;
}

/** Data URI mínima: só `#`, `"`, `<`, `>` e `%` precisam de escape em CSS. */
function toDataUri(svg) {
  const compact = svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const escaped = compact
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/"/g, "'");
  return `data:image/svg+xml,${escaped}`;
}

async function main() {
  await stat(FA_DIR).catch(() => {
    throw new Error('@fortawesome/fontawesome-free não instalado; rode npm install');
  });

  const icons = await collectIcons();
  const missing = [];
  const rules = [];

  for (const { style, name } of icons) {
    const svg = await readSvg(style, name);
    if (!svg) {
      missing.push(`${style ?? 'fa?'} fa-${name}`);
      continue;
    }

    // O viewBox do Font Awesome varia em largura; sem isso ícones largos
    // ficariam achatados dentro de uma caixa quadrada de 1em.
    const [, , width, height] = (svg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 512 512').split(/\s+/);
    const ratio = (Number(width) / Number(height)).toFixed(4);

    // Sem prefixo `-webkit-`: o browserslist do projeto não alcança navegador
    // que precise dele, e duplicar a data URI dobrava a folha. O autoprefixer
    // do build recoloca o prefixo se o alvo mudar.
    rules.push(
      [`.fa-${name} {`, `  width: ${ratio}em;`, `  mask-image: url("${toDataUri(svg)}");`, '}'].join(
        '\n'
      )
    );
  }

  if (missing.length) throw new Error(`ícone sem SVG correspondente: ${missing.join(', ')}`);

  const base = `.fas,
.far,
.fab {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  background-color: currentColor;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}`;

  const header = [
    '/* Gerado por tools/build-icon-css.mjs — não editar à mão. */',
    `/* ${rules.length} ícones do Font Awesome Free, embutidos como máscara. */`,
    ''
  ].join('\n');

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, 'icons.css'), `${header}${base}\n\n${rules.join('\n\n')}\n`);
  console.log(`ícones: ${rules.length} regras em src/styles/icons.css`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
