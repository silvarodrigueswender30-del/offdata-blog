/**
 * src/utils/readingTime.ts
 * Estima o tempo de leitura de um texto Markdown/MDX.
 * Sem dependências externas.
 */

/** Palavras por minuto usadas como base do cálculo. */
const WPM = 200;

/**
 * Remove construções Markdown/MDX que não representam palavras legíveis,
 * retornando apenas o texto puro para contagem.
 */
function stripMarkdown(content: string): string {
  return (
    content
      // Blocos de código cercados (``` ... ```)
      .replace(/```[\s\S]*?```/g, ' ')
      // Código inline (`...`)
      .replace(/`[^`]*`/g, ' ')
      // Blocos de frontmatter YAML (--- ... ---)
      .replace(/^---[\s\S]*?---/m, '')
      // Tags MDX / JSX (<Component ... /> ou <tag>...</tag>)
      .replace(/<[^>]+>/g, ' ')
      // Cabeçalhos Markdown (# Título)
      .replace(/^#{1,6}\s+/gm, '')
      // Imagens ![alt](url) — remove completamente
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' ')
      // Links [texto](url) — mantém apenas o texto visível
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      // Links de referência [texto][ref] — mantém o texto
      .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
      // Negrito/itálico: *** / ** / * / __ / _
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
      // Strikethrough ~~texto~~
      .replace(/~~([^~]+)~~/g, '$1')
      // Linhas horizontais (---, ***, ___)
      .replace(/^[-*_]{3,}\s*$/gm, '')
      // Blockquotes (> texto)
      .replace(/^>\s+/gm, '')
      // Listas (-, *, +, 1.)
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // URLs soltas
      .replace(/https?:\/\/\S+/g, ' ')
      // Colapsa espaços em branco múltiplos
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Estima o tempo de leitura de um conteúdo Markdown/MDX.
 *
 * @param content - Texto bruto do arquivo .md ou .mdx (incluindo frontmatter).
 * @returns Número de minutos arredondado para cima, mínimo 1.
 *
 * @example
 * getReadingTime("# Título\n\nUm parágrafo curto.")  // 1
 * getReadingTime(longArticleString)                   // 7
 */
export function getReadingTime(content: string): number {
  const plainText  = stripMarkdown(content);
  const wordCount  = plainText.split(/\s+/).filter(Boolean).length;
  const minutes    = Math.ceil(wordCount / WPM);
  return Math.max(1, minutes);
}
