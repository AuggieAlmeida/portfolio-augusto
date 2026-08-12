import imageManifest from './image-manifest.json';

/** Uma imagem já resolvida em derivadas: o template só interpola strings. */
export interface ResponsiveImage {
  src: string;
  avif: string;
  webp: string;
  width: number;
  height: number;
}

const MANIFEST = imageManifest as Record<string, ResponsiveImage>;

/**
 * Resolve a chave do master para as derivadas geradas por
 * `tools/optimize-images.mjs`. Chave sem derivada devolve `null` — é erro de
 * conteúdo, e cair no fallback visual é melhor do que emitir `<img>` que
 * responde 404.
 */
export function resolveImage(key: string | undefined): ResponsiveImage | null {
  if (!key) return null;
  return MANIFEST[key] ?? null;
}
