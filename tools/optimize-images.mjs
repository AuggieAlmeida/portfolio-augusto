#!/usr/bin/env node
/**
 * Converte os masters de `src/assets/images/masters/` em derivadas responsivas
 * AVIF/WebP e num JPEG de fallback, e escreve o manifesto que o catálogo lê.
 *
 * Motivo: os assets somavam ~37 MB, com PNGs de 2 a 6 MB servidos em cartões de
 * 384 px. `NgOptimizedImage` não reduz o arquivo de origem — quem reduz é este
 * passo. Os masters ficam fora do bundle (ver `ignore` em angular.json) e
 * existem só para permitir regerar as derivadas.
 *
 * Rodar sob demanda: `npm run images`.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'src/app/core/images/image-manifest.json');

const GROUPS = [
  {
    // 480 cobre o cartão móvel (280 px em 2x já cabe), 960 o cartão desktop em
    // 2x, 1440 o modal em tela larga. Acima disso é captura maior que a área
    // útil.
    masters: 'src/assets/images/masters',
    out: 'src/assets/images/projects',
    publicPath: './assets/images/projects',
    widths: [480, 960, 1440],
    fallbackWidth: 960
  },
  {
    // O retrato do herói é renderizado num círculo de 192 px.
    masters: 'src/assets/images/masters-hero',
    out: 'src/assets/images/hero',
    publicPath: 'assets/images/hero',
    widths: [192, 384],
    fallbackWidth: 384
  }
];

const SOURCE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const srcset = (entries) => entries.map(({ file, width }) => `${file} ${width}w`).join(', ');

async function processGroup(group, manifest) {
  const mastersDir = join(ROOT, group.masters);
  const outDir = join(ROOT, group.out);
  const files = (await readdir(mastersDir)).filter((file) =>
    SOURCE_EXT.has(extname(file).toLowerCase())
  );
  if (!files.length) throw new Error(`nenhum master em ${group.masters}`);

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  let masterBytes = 0;
  let outputBytes = 0;

  for (const file of files.sort()) {
    const name = basename(file, extname(file));
    const buffer = await readFile(join(mastersDir, file));
    masterBytes += buffer.length;

    const { width: sourceWidth, height: sourceHeight } = await sharp(buffer).metadata();
    // Nunca ampliar: uma captura de 800 px virando 1440 só gera peso.
    const widths = group.widths.filter((width) => width <= sourceWidth);
    if (!widths.length) widths.push(sourceWidth);

    const avif = [];
    const webp = [];

    for (const width of widths) {
      const resized = sharp(buffer).resize({ width, withoutEnlargement: true });

      const avifFile = `${name}-${width}.avif`;
      const avifBuffer = await resized.clone().avif({ quality: 55, effort: 5 }).toBuffer();
      await writeFile(join(outDir, avifFile), avifBuffer);
      avif.push({ file: `${group.publicPath}/${avifFile}`, width });
      outputBytes += avifBuffer.length;

      const webpFile = `${name}-${width}.webp`;
      const webpBuffer = await resized.clone().webp({ quality: 78 }).toBuffer();
      await writeFile(join(outDir, webpFile), webpBuffer);
      webp.push({ file: `${group.publicPath}/${webpFile}`, width });
      outputBytes += webpBuffer.length;
    }

    const fallbackWidth = Math.min(group.fallbackWidth, sourceWidth);
    const fallbackFile = `${name}-${fallbackWidth}.jpg`;
    const fallbackBuffer = await sharp(buffer)
      .resize({ width: fallbackWidth, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    await writeFile(join(outDir, fallbackFile), fallbackBuffer);
    outputBytes += fallbackBuffer.length;

    const scale = fallbackWidth / sourceWidth;
    manifest[name] = {
      src: `${group.publicPath}/${fallbackFile}`,
      avif: srcset(avif),
      webp: srcset(webp),
      width: fallbackWidth,
      height: Math.round(sourceHeight * scale)
    };
  }

  return { count: files.length, masterBytes, outputBytes };
}

async function main() {
  const manifest = {};
  let count = 0;
  let masterBytes = 0;
  let outputBytes = 0;

  for (const group of GROUPS) {
    const result = await processGroup(group, manifest);
    count += result.count;
    masterBytes += result.masterBytes;
    outputBytes += result.outputBytes;
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

  const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);
  console.log(`imagens: ${count} masters (${mb(masterBytes)} MB) → ${mb(outputBytes)} MB servidos`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
