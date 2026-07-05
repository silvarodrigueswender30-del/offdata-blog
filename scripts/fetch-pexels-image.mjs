#!/usr/bin/env node
/**
 * scripts/fetch-pexels-image.mjs
 *
 * Busca uma imagem na API Pexels e salva como capa de um post do blog.
 *
 * Uso:
 *   node scripts/fetch-pexels-image.mjs "termo de busca" "slug-do-post"
 *
 * Exemplo:
 *   node scripts/fetch-pexels-image.mjs "seo analytics dashboard" "seo-local-uberlandia"
 *
 * Requisitos:
 *   - Node.js ≥ 18 (fetch nativo, Readable.fromWeb, pipeline)
 *   - process.loadEnvFile() exige Node ≥ 20.12 — fallback manual incluído
 *     para Node 18–20.11 (sem dependências externas)
 *   - PEXELS_API_KEY definida no arquivo .env da raiz do projeto
 */

import { createWriteStream, mkdirSync, readFileSync } from 'node:fs';
import { pipeline }                                   from 'node:stream/promises';
import { Readable }                                   from 'node:stream';
import path                                           from 'node:path';
import { fileURLToPath }                              from 'node:url';

// ─── Caminhos ─────────────────────────────────────────────────────────────────
const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_PATH     = path.join(PROJECT_ROOT, '.env');

// ─── 1. Carregar .env ─────────────────────────────────────────────────────────
// Usa process.loadEnvFile() (Node ≥ 20.12) com fallback para parse manual
// sem dependências externas (Node 18–20.11).
function loadDotenv(filepath) {
  // Caminho preferencial: API nativa do Node
  if (typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile(filepath);
    } catch {
      // Arquivo .env inexistente é aceitável — a chave pode vir do ambiente
    }
    return;
  }

  // Fallback: parse manual do .env para Node 18–20.11
  try {
    const content = readFileSync(filepath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;      // ignora comentários

      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;

      const key   = trimmed.slice(0, eqIdx).trim();
      let   value = trimmed.slice(eqIdx + 1).trim();

      // Remove aspas envolventes (" ou ')
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      // Não sobrescreve variáveis já definidas no ambiente de execução
      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env ausente → continua; PEXELS_API_KEY virá de outra fonte ou falhará
    // na validação abaixo
  }
}

loadDotenv(ENV_PATH);

// ─── Validação da API key ──────────────────────────────────────────────────────
const PEXELS_API_KEY = process.env.PEXELS_API_KEY?.trim();

if (!PEXELS_API_KEY) {
  console.error(
    'Erro: PEXELS_API_KEY não encontrada.\n' +
    `Adicione PEXELS_API_KEY=sua_chave ao arquivo .env em: ${ENV_PATH}\n` +
    'Obtenha uma chave gratuita em: https://www.pexels.com/api/'
  );
  process.exit(1);
}

// ─── Argumentos de linha de comando ───────────────────────────────────────────
const [searchTerm, postSlug] = process.argv.slice(2);

if (!searchTerm || !postSlug) {
  console.error(
    'Uso: node scripts/fetch-pexels-image.mjs "termo de busca" "slug-do-post"\n' +
    'Exemplo: node scripts/fetch-pexels-image.mjs "seo analytics" "seo-local-uberlandia"'
  );
  process.exit(1);
}

// ─── 2. Buscar na API Pexels ──────────────────────────────────────────────────
const PEXELS_SEARCH = 'https://api.pexels.com/v1/search';
const searchUrl     = new URL(PEXELS_SEARCH);
searchUrl.searchParams.set('query',       searchTerm);
searchUrl.searchParams.set('orientation', 'landscape');
searchUrl.searchParams.set('size',        'large');
searchUrl.searchParams.set('per_page',    '5');

/** @type {Response} */
let searchRes;
try {
  searchRes = await fetch(searchUrl.toString(), {
    headers: { Authorization: PEXELS_API_KEY },
  });
} catch (err) {
  console.error(
    `Erro de rede: não foi possível conectar à API Pexels.\nDetalhe: ${err.message}`
  );
  process.exit(1);
}

// Trata erros HTTP da API
if (!searchRes.ok) {
  const status = searchRes.status;

  if (status === 401) {
    console.error(
      'Erro: PEXELS_API_KEY inválida ou expirada (HTTP 401).\n' +
      'Verifique a chave em: https://www.pexels.com/api/new/'
    );
  } else if (status === 429) {
    console.error(
      'Erro: limite de requisições atingido na API Pexels (HTTP 429).\n' +
      'Aguarde alguns minutos e tente novamente.'
    );
  } else {
    console.error(
      `Erro: API Pexels retornou status inesperado: ${status} ${searchRes.statusText}`
    );
  }
  process.exit(1);
}

/** @type {{ photos: Array<{ src: Record<string,string>, photographer: string, url: string }>, total_results: number }} */
const searchData = await searchRes.json();

// ─── 3. Escolher a foto ───────────────────────────────────────────────────────
if (!searchData.photos || searchData.photos.length === 0) {
  console.error(
    `Erro: nenhuma foto encontrada para o termo "${searchTerm}".\n` +
    'Tente um termo mais genérico (ex: "technology business", "data analytics").'
  );
  process.exit(1);
}

const photo      = searchData.photos[0];
const imageUrl   = photo.src.large2x || photo.src.large;   // prefere large2x
const photoCredit = photo.photographer;
const pexelsUrl   = photo.url;

if (!imageUrl) {
  console.error(
    'Erro: a foto retornada não possui variante "large2x" nem "large".\n' +
    'Tente novamente — a próxima busca pode retornar uma foto diferente.'
  );
  process.exit(1);
}

// ─── 4. Criar diretório e baixar a imagem ─────────────────────────────────────
const destDir  = path.join(PROJECT_ROOT, 'public', 'images', 'posts', postSlug);
const destFile = path.join(destDir, 'cover.jpg');

mkdirSync(destDir, { recursive: true });

/** @type {Response} */
let imageRes;
try {
  imageRes = await fetch(imageUrl);
} catch (err) {
  console.error(
    `Erro de rede: não foi possível baixar a imagem de ${imageUrl}\nDetalhe: ${err.message}`
  );
  process.exit(1);
}

if (!imageRes.ok) {
  console.error(
    `Erro: falha ao baixar a imagem (HTTP ${imageRes.status} ${imageRes.statusText}).\n` +
    `URL tentada: ${imageUrl}`
  );
  process.exit(1);
}

// Converte Web ReadableStream → Node Readable e grava no disco
// Readable.fromWeb() disponível desde Node 16.11 (inclui Node 18+)
try {
  const fileStream = createWriteStream(destFile);
  await pipeline(Readable.fromWeb(imageRes.body), fileStream);
} catch (err) {
  console.error(
    `Erro: falha ao gravar a imagem em ${destFile}\nDetalhe: ${err.message}`
  );
  process.exit(1);
}

// ─── 5. Saída JSON para parsing pelo Antigravity ──────────────────────────────
// coverImageAlt propositalmente vazio — texto descritivo deve ser escrito
// por quem produz o conteúdo, não inferido da API.
const result = {
  coverImage:         `/images/posts/${postSlug}/cover.jpg`,
  coverImageAlt:      '',
  coverImageCredit:   `Foto de ${photoCredit} via Pexels`,
  coverImageSourceUrl: pexelsUrl,
};

// Separador visual para facilitar o parsing quando há logs anteriores no stderr
process.stdout.write('\n');
console.log(JSON.stringify(result, null, 2));
