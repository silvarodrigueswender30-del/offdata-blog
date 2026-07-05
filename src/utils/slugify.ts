/**
 * src/utils/slugify.ts
 * Converte qualquer string em um slug URL-safe.
 * Sem dependências externas.
 */

/**
 * Transforma um texto arbitrário em slug.
 *
 * @example
 * slugify("SEO Local")           // "seo-local"
 * slugify("Tráfego Pago B2B")    // "trafego-pago-b2b"
 * slugify("  --Olá, Mundo!-- ")  // "ola-mundo"
 */
export function slugify(text: string): string {
  return (
    text
      // 1. Normaliza para NFD e remove todos os diacríticos (acentos, cedilha, etc.)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // 2. Converte para lowercase
      .toLowerCase()
      // 3. Substitui qualquer caractere não alfanumérico por hífen
      .replace(/[^a-z0-9]+/g, '-')
      // 4. Remove hífens nas extremidades
      .replace(/^-+|-+$/g, '')
  );
}
