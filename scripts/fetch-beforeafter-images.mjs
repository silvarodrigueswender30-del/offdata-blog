#!/usr/bin/env node
/**
 * scripts/fetch-beforeafter-images.mjs
 * Baixa 10 imagens comprimidas do Pexels (max 1000px, compressed) para o componente SegmentBeforeAfter
 */

import { createWriteStream, mkdirSync, readFileSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_PATH     = path.join(PROJECT_ROOT, '.env');

function loadDotenv(filepath) {
  if (typeof process.loadEnvFile === 'function') {
    try { process.loadEnvFile(filepath); } catch {}
    return;
  }
  try {
    const content = readFileSync(filepath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (key && !(key in process.env)) process.env[key] = value;
    }
  } catch {}
}

loadDotenv(ENV_PATH);

const PEXELS_API_KEY = process.env.PEXELS_API_KEY?.trim();
if (!PEXELS_API_KEY) {
  console.error('PEXELS_API_KEY não encontrada no .env');
  process.exit(1);
}

const IMAGES = [
  { query: 'old slow computer office frustrated work',  slug: 'before-after-bad',        orientation: 'landscape' },
  { query: 'law office modern professional desk',       slug: 'before-after-advogados',   orientation: 'landscape' },
  { query: 'architecture studio modern design table',   slug: 'before-after-arquitetos',  orientation: 'landscape' },
  { query: 'landscaping beautiful garden design',       slug: 'before-after-paisagistas', orientation: 'landscape' },
  { query: 'plumber professional modern service',       slug: 'before-after-encanadores', orientation: 'landscape' },
  { query: 'fashion clothing store boutique modern',    slug: 'before-after-loja-roupa',  orientation: 'landscape' },
  { query: 'therapy office cozy modern counseling',     slug: 'before-after-psicologos',  orientation: 'landscape' },
  { query: 'sneaker store modern retail display',       slug: 'before-after-loja-tenis',  orientation: 'landscape' },
  { query: 'real estate modern office building',        slug: 'before-after-imobiliaria', orientation: 'landscape' },
  { query: 'construction modern building site',         slug: 'before-after-construtora', orientation: 'landscape' },
];

async function fetchAndSave({ query, slug, orientation }) {
  const dest = path.join(PROJECT_ROOT, 'public', 'images', 'before-after', `${slug}.jpg`);
  mkdirSync(path.dirname(dest), { recursive: true });

  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('orientation', orientation);
  url.searchParams.set('size', 'medium');
  url.searchParams.set('per_page', '3');

  const searchRes = await fetch(url.toString(), { headers: { Authorization: PEXELS_API_KEY } });
  if (!searchRes.ok) {
    console.error(`Erro na busca "${query}": HTTP ${searchRes.status}`);
    return null;
  }

  const data = await searchRes.json();
  if (!data.photos?.length) {
    console.error(`Nenhuma foto para "${query}"`);
    return null;
  }

  const photo = data.photos[0];
  const rawUrl = photo.src.large || photo.src.medium || photo.src.original;
  const urlObj = new URL(rawUrl);
  urlObj.searchParams.set('w', '1000');
  urlObj.searchParams.set('auto', 'compress');
  urlObj.searchParams.set('cs', 'tinysrgb');
  const imageUrl = urlObj.toString();

  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    console.error(`Falha ao baixar imagem: HTTP ${imgRes.status}`);
    return null;
  }

  await pipeline(Readable.fromWeb(imgRes.body), createWriteStream(dest));
  console.log(`OK: ${slug} — "${query}" — foto de ${photo.photographer}`);
  return { slug, path: `/images/before-after/${slug}.jpg`, photographer: photo.photographer, pexelsUrl: photo.url };
}

console.log(`\nBaixando ${IMAGES.length} imagens comprimidas do Pexels...\n`);

const results = [];
for (const img of IMAGES) {
  const result = await fetchAndSave(img);
  if (result) results.push(result);
  await new Promise(r => setTimeout(r, 200));
}

console.log('\n=== RESULTADO ===');
console.log(JSON.stringify(results, null, 2));
