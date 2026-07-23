// src/content.config.ts — Astro 5.x (Collections API com glob loader)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    // ── Conteúdo ──────────────────────────────────────────────────────
    title: z.string(),

    // Máx. 160 chars — usado como <meta name="description"> e excerpt do card
    description: z.string().max(160),

    // ── Datas ─────────────────────────────────────────────────────────
    pubDate:     z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // ── Taxonomia ─────────────────────────────────────────────────────
    // Texto livre por decisão de produto — sem enum fixo
    category: z.string(),
    tags:     z.array(z.string()).default([]),

    // ── Imagem de capa ────────────────────────────────────────────────
    coverImage:          z.string(),
    coverImageAlt:       z.string(),
    // Crédito da imagem (preenchido automaticamente pelo fetch-pexels-image.mjs)
    // Opcional — posts com imagem própria não precisam preencher.
    coverImageCredit:    z.string().optional(),
    coverImageSourceUrl: z.string().url().optional(),

    // ── Metadados de publicação ───────────────────────────────────────
    author:  z.string().default('Off-Data'),
    draft:   z.boolean().default(false),
    noindex: z.boolean().default(false),

    // ── Página de segmento ────────────────────────────────────────────
    // Quando true, o [slug].astro suprime a cover image padrão do cabeçalho
    // pois o SegmentHero dentro do MDX já cumpre esse papel.
    isSegment: z.boolean().default(false),

    // ── FAQ (Perguntas Frequentes) ────────────────────────────────────
    // Opcional. Se preenchido, o layout renderiza automaticamente o bloco
    // de FAQ visual + FAQPage JSON-LD para rich snippets no Google.
    // Formato: array de objetos { q: string, a: string }
    faq: z.array(
      z.object({
        q: z.string(),
        a: z.string(),
      })
    ).optional(),
  }),
});

export const collections = { posts };
