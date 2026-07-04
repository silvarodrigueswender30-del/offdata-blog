// src/content.config.ts — Astro 5.x (Collections API com glob loader)
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Off-Data'),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    canonicalURL: z.string().url().optional(),
    readingTime: z.number().optional(), // minutos estimados
  }),
});

export const collections = { posts };
