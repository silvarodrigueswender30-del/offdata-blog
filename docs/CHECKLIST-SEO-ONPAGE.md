# Checklist de SEO On-Page — Padrão Ouro Off-Data

Este documento serve como o "Cérebro Auxiliar" para a criação de todo conteúdo (páginas de serviço e blog posts). Ele complementa a `METODOLOGIA-cluster-palavras-chave.md` (que foca na estratégia macro) e o `GUIA-voz-editorial-v2.md` (que foca no tom de voz).

O Antigravity (e qualquer redator) deve validar estes 15 pontos em toda nova publicação.

### 1. Head & Metadata (O que o Google indexa primeiro)
* **Title tag:** 50-60 caracteres, palavra-chave primária perto do início.
* **Meta description:** 150-160 caracteres, palavra-chave + benefício + CTA suave.
* **Canonical URL:** Configurada para prevenir duplicatas (Automático no Astro).
* **Open Graph & Twitter Cards:** Tags completas (og:title, og:image 1200x630, etc.) (Automático no Astro).
* **Atributos base:** `lang="pt-BR"`, charset, viewport, favicon (Automático no Astro).

### 2. Estrutura de URL
* **Short slug:** Abaixo de 60 caracteres, contendo a palavra-chave primária.
* **Formatação:** Apenas hifens, somente minúsculas, sem stop words ("o", "a", "de").
* **Hierarquia:** `/blog/[slug]` ou `/servicos/[slug]`.

### 3. Cabeçalhos (Para leitores rápidos e bots)
* **H1 Único:** Exatamente um H1 por página com a keyword primária (Automático no título do post).
* **Hierarquia lógica H2 -> H3:** Nunca pular níveis.
* **H2s Estratégicos:** Usam palavras-chave de suporte e perguntas do cluster (People Also Ask).
* **Naturalidade:** Sem keyword stuffing.

### 4. Copy & Body (Responder à consulta, rapidamente)
* **Keyword primária:** Presente nas primeiras 100 palavras.
* **Resposta direta:** Entregue logo no primeiro parágrafo (nada de enrolação).
* **Escaneabilidade:** Parágrafos curtos (1-4 sentenças), listas numeradas/marcadores, negrito com parcimônia.
* **Voz ativa e legibilidade:** Texto fluido e direto.

### 5. Seção FAQ
* **Volume:** 4-8 perguntas baseadas no SEMrush / People Also Ask.
* **Respostas:** Diretas e curtas (2-4 sentenças).
* **Schema:** JSON-LD de FAQ aplicado na página.

### 6. Imagens (Sinais de ranqueamento)
* **Alt text:** Descritivo + palavra-chave onde for natural.
* **Nomes de arquivo:** Hifenizados e descritivos (ex: `seo-local-clinicas.jpg`).
* **Performance:** Formatos modernos (WebP/JPG otimizado), atributos width/height, lazy loading (Automático via Astro Image).

### 7. Links Internos (Fluxo de Autoridade)
* **Volume:** 3-5 links internos por post.
* **Alvos:** Posts Tier 2/3 relacionados ou páginas de serviço (`/blog` -> site institucional).
* **Texto âncora:** Descritivo e contextual (Nunca "clique aqui").

### 8. Links Externos (Citação de Autoridade)
* **Volume:** 2-3 links para fontes de altíssima autoridade (dados, estudos, ferramentas).
* **Atributos:** Abertura em nova aba (`target="_blank" rel="noopener"`). `rel="nofollow"` apenas se for patrocinado.

### 9. Schema Markup (JSON-LD)
* **Implementação:** Article, LocalBusiness, Service, FAQ, BreadcrumbList, Organization (Tratados no `<head>` das páginas Astro/React correspondentes).

### 10. E-E-A-T Signals (Experiência, Expertise, Autoridade, Confiança)
* **Autoria:** Byline, bio, cargo (Automático no Astro via frontmatter).
* **Datas:** Data de publicação e atualização visíveis.
* **Fatos:** Uso rigoroso de dados reais do arquivo de voz da empresa.

### 11. Acessibilidade (A11y = SEO)
* **HTML Semântico:** Uso correto de tags estruturais (`<main>`, `<article>`, etc) (Automático no Astro).
* **Contraste e Foco:** Garantidos pelo CSS base.
* **ARIA & Alt:** Textos alternativos preenchidos e labels onde necessário.

### 12. Mobile & Responsive (Mobile-first)
* **Layout:** Adaptável sem rolagem horizontal (Garantido pelo CSS/Tailwind).
* **Usabilidade:** Alvos de toque grandes, fontes legíveis (16px+).

### 13. Social Preview
* **Imagem de Capa (OG Image):** Design no padrão da marca, proporção 1200x630.
* **Description OG:** Atraente para o clique social.

### 14. Elementos de Conversão (Específico para Páginas de Serviço)
* **Acima da dobra:** CTA Primário visível imediatamente.
* **Fricção zero:** Número com *click-to-call* e formulários acessíveis.
* **Trust factors:** Provas sociais, avaliações, endereço físico e horários claros.

### 15. Long-form Content
* **Profundidade:** Posts pilares com contagem ideal de palavras para vencer a SERP.
* **Navegação:** Sumário (Table of Contents) gerado automaticamente com âncoras para H2.
