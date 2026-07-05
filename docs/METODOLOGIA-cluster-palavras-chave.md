# Metodologia de Cluster de Palavras-Chave — Blog Off-Data

## Objetivo
Evitar dois erros comuns de blog corporativo: (1) escrever sobre o que "parece
interessante" sem validar se alguém busca aquilo, e (2) publicar dois posts
competindo pela mesma palavra-chave (canibalização — o Google não sabe qual
rankear, e nenhum dos dois sobe).

## Ferramentas (uso gratuito)
- **SEMrush** (Keyword Magic Tool) — free tem limite de buscas/dia na conta
  sem cartão. Use para volume de busca e "keyword difficulty".
- **Ubersuggest (Neil Patel)** — free tem limite de 3 buscas/dia sem login,
  mais com conta gratuita. Bom para volume + CPC + sazonalidade (gráfico de
  tendência mensal).
- Ambas se complementam: cruze os números, não confie em uma fonte isolada
  (as duas estimam volume de forma diferente — divergência de 20-30% é normal).

## Passo 1 — Definir os Pilares (Pillar Topics)
Antes de buscar qualquer palavra-chave, liste os 3-5 grandes temas que a
Off-Data quer ser referência. Isso vem das linhas de serviço da agência, não
de "o que está em alta". Exemplo de estrutura (ajuste aos seus serviços reais):

- Pilar 1: [ex. SEO Local]
- Pilar 2: [ex. Tráfego Pago]
- Pilar 3: [ex. Desenvolvimento de Sites/Landing Pages]
- Pilar 4: [ex. Identidade de Marca]

Cada pilar vai virar uma categoria no blog (campo `category` do frontmatter).

## Passo 2 — Pesquisa por pilar
Para cada pilar, no SEMrush/Ubersuggest:
1. Busque o termo "cabeça" (ex: "seo local") e anote volume + dificuldade
2. Abra as sugestões relacionadas/"keyword ideas" e colete 15-30 variações
   long-tail (ex: "como aparecer no google meu negócio", "seo local
   uberlândia", "quanto custa seo local")
3. Descarte termos com volume muito baixo (praticamente zero) E dificuldade
   alta ao mesmo tempo — não vale o esforço
4. Priorize: volume médio + dificuldade baixa/média = melhor primeiro alvo

## Passo 3 — Classificar por intenção de busca
Cada palavra-chave coletada entra numa destas categorias:
- **Informacional** ("o que é", "como fazer", "por que") → post educativo,
  é a maioria do conteúdo de blog
- **Comparativa** ("X vs Y", "melhores ferramentas de") → post de comparação
- **Comercial/transacional** ("contratar", "preço de", "quanto custa") →
  post que já pode empurrar suavemente pro CTA de contato

## Passo 4 — Montar o cluster por camada de dificuldade (não só por pilar)

Erro comum: escolher só a palavra-chave de maior volume pra cada post. Isso
quase sempre significa maior dificuldade também — e um domínio novo não
compete com quem já rankeia ali há anos. A estratégia correta é misturar
camadas de dificuldade DENTRO do mesmo cluster, pra construir autoridade
antes de atacar o termo mais competitivo:

- **Tier 1 — Ganho rápido (maioria dos posts iniciais):** dificuldade
  baixa/média, volume moderado. São os posts que realisticamente rankeiam
  em semanas/poucos meses com um domínio novo. Objetivo: gerar tráfego real
  e sinal de autoridade pro Google rápido.
- **Tier 2 — Meio de cluster:** dificuldade média, volume médio/alto.
  Só ataque depois que 2-3 posts Tier 1 do mesmo pilar já estiverem
  publicados e indexados — eles vão linkar internamente pro Tier 2,
  transferindo parte da autoridade.
- **Tier 3 — Aspiracional (o "post pilar" cabeça de cluster):** dificuldade
  alta, maior volume. É o post que você quer que rankeie no fim, mas não é
  o primeiro a publicar. Ele recebe links internos de TODOS os posts Tier 1
  e Tier 2 do mesmo pilar — é o destino da autoridade acumulada, não o ponto
  de partida.

Ordem de publicação recomendada por pilar: 2-4 posts Tier 1 primeiro →
1-2 Tier 2 → só então o Tier 3. Isso pode levar meses num pilar, e está certo
— é assim que cluster de conteúdo funciona de verdade, não é sobre publicar
rápido, é sobre publicar na ordem que constrói autoridade.

Estrutura final por pilar, com tier marcado:

```
PILAR: SEO Local
├── [Tier 1] "Como aparecer no Google Meu Negócio em 2026"        ← publica 1º
├── [Tier 1] "SEO Local em Uberlândia: guia prático"               ← publica 2º
├── [Tier 2] "SEO Local vs Tráfego Pago: qual escolher primeiro"   ← publica 3º
└── [Tier 3] "O que é SEO Local e por que sua empresa precisa disso" ← publica por último (post pilar)
```

## Passo 5 — Registro de controle (evita canibalização)
Preencha esta tabela ANTES de publicar cada post — é a fonte de verdade que
o Antigravity consulta antes de escrever um post novo, pra nunca repetir
palavra-chave já usada:

| Palavra-chave alvo | Pilar | Tier | Volume (aprox.) | Status | Slug do post |
|---|---|---|---|---|---|
| como aparecer no google meu negócio | SEO Local | 1 | — | Publicado | como-aparecer-google-meu-negocio |
| seo local | SEO Local | 3 (aspiracional) | — | A escrever | — |

Regra: uma palavra-chave "cabeça" só pode ser alvo principal de UM post.
Variações da mesma palavra-chave (ex: "seo local" e "o que é seo local") vão
pro MESMO post, uma como alvo principal e outra como secundária no texto.

## Entregável desta etapa
Um arquivo `keyword-cluster-map.md` (cópia deste template preenchido com dados
reais) guardado na raiz do repo do blog. Antes de cada sessão de escrita, o
Antigravity lê esse arquivo, marca a linha usada como "Publicado" e preenche
o slug.
