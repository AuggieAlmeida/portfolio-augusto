#!/usr/bin/env node
/**
 * Guards the two failure modes ngx-translate fails silently on: a locale that
 * drifted from the others, and a key referenced by code that no locale defines.
 * Both render the raw key string on screen instead of throwing.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const I18N_DIR = 'src/assets/i18n';
const COMPONENTS_DIR = 'src/app/components';

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === 'object' ? flatten(value, path) : [path];
  });

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const locales = readdirSync(I18N_DIR)
  .filter((file) => file.endsWith('.json'))
  .map((file) => ({
    name: file.replace(/\.json$/, ''),
    keys: new Set(flatten(JSON.parse(readFileSync(join(I18N_DIR, file), 'utf8'))))
  }));

if (locales.length === 0) {
  console.error('No locale files found in %s', I18N_DIR);
  process.exit(1);
}

const files = walk(COMPONENTS_DIR);
const referenced = new Set();

for (const file of files) {
  const source = readFileSync(file, 'utf8');

  if (file.endsWith('.json')) {
    // Data files address translations through fields named *Key / *Keys.
    for (const [, value] of source.matchAll(/"\w*Keys?"\s*:\s*("(?:[^"]+)"|\[[^\]]*\])/g)) {
      for (const [, key] of value.matchAll(/"([^"]+)"/g)) referenced.add(key);
    }
    continue;
  }

  // Single-segment keys count too: `{{ 'language' | translate }}` shipped a raw
  // key to production because an earlier version of this check required a dot.
  for (const [, key] of source.matchAll(/'([a-zA-Z][\w]*(?:\.[\w]+)*)'\s*\|\s*translate/g)) {
    referenced.add(key);
  }
  for (const [, key] of source.matchAll(/translate\.instant\(\s*'([^']+)'/g)) {
    referenced.add(key);
  }
}

const problems = [];
const union = new Set(locales.flatMap((locale) => [...locale.keys]));

for (const locale of locales) {
  const missing = [...union].filter((key) => !locale.keys.has(key)).sort();
  if (missing.length > 0) {
    problems.push(
      `${locale.name}.json is missing ${missing.length} key(s):\n  ${missing.join('\n  ')}`
    );
  }
}

for (const locale of locales) {
  const undefinedKeys = [...referenced].filter((key) => !locale.keys.has(key)).sort();
  if (undefinedKeys.length > 0) {
    problems.push(
      `${locale.name}.json does not define ${undefinedKeys.length} key(s) referenced in code:\n  ${undefinedKeys.join('\n  ')}`
    );
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n\n'));
  process.exit(1);
}

console.log(
  'i18n ok — %d locale(s) (%s), %d key(s) each, %d referenced in code.',
  locales.length,
  locales.map((locale) => locale.name).join(', '),
  union.size,
  referenced.size
);
