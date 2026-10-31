# BENZA — Handoff para protótipo navegável

> **Atualização — branding v2 (out/2026):** o novo branding (logo "benza" em minúsculas, selo Approved, vermelho `#D3301B`, cartões arredondados, Gaya nos títulos) substitui as regras da §3 e as cores das linhas da §4. A fonte de verdade agora é `tokens.json`/`tokens.css`. Logos e selo ficam em `public/assets/brand/` (originais em `assets/brand-v2/`). O site usa somente **duas famílias: Outfit (títulos e texto) e Gaya (tagline, ênfases e detalhes)**. A Gaya está em licença de teste: fica só local em `public/fonts/gaya/` (no `.gitignore`); sem ela, esses trechos caem numa serifada genérica.

> Para o Claude Code: leia este arquivo inteiro antes de começar. Depois leia `tokens.json`, `tokens.css`, `data/taxonomy.json`, `data/products.sample.json` e abra os HTMLs em `reference/` como referência visual exata.

## 1. Objetivo

Construir um **protótipo navegável e responsivo** do site da BENZA, um marketplace curado de sex wellness. Ele roda localmente e pode ser publicado na Vercel para mostrar a stakeholders.

- **Sem checkout real e sem backend.** O carrinho fica em estado local (Context + localStorage). Pagamento, login e estoque ficam fora do escopo.
- **A plataforma de loja ainda não foi decidida** (Shopify, Medusa, outra). Todo acesso a dados passa por uma camada única em `lib/catalog.ts`, que hoje lê os JSONs de `/data` e amanhã pode ser trocada por uma API sem mexer nos componentes.

## 2. Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS, com as cores, fontes e espaçamentos de `tokens.json` mapeados no `tailwind.config` e as variáveis de `tokens.css` em `globals.css`
- Fontes via `next/font/google`: Cormorant Garamond (400/500, com itálico), Hanken Grotesk (400/500/600) e DM Mono (400/500)
- Imagens com `next/image`, a partir de `public/assets/` (copiar a pasta `assets/` deste pacote)
- Sem bibliotecas de UI. Componentes próprios, simples e acessíveis.

## 3. Marca: regras que não podem quebrar

1. O **wordmark BENZA** e a **tagline "the good kind of secret"** são SVGs vetorizados das explorações da designer, em `assets/brand/`. Use sempre o SVG e **nunca** redigite em fonte. Variantes de cor:
   - `wordmark-coralsoft.svg` e `wordmark-sand.svg` para fundos escuros
   - `wordmark-ink.svg` para fundos claros
   - `tagline-*.svg`, uma por clima
2. **Sem fontes script.** Títulos em peso 400/500, nunca bold.
3. Ênfase em *itálico* ou entre parênteses, como "Conheça *(o seu)* corpo" e "*(Linhas)*".
4. Texto claro sobre fundo escuro usa **areia `#DCCBB6`**, nunca branco nem creme puro. A designer pediu contraste mais suave.
5. Labels, preços, contadores `[00]` e botões usam **DM Mono em caixa-alta**, com letter-spacing de 0.1 a 0.12em.
6. Cantos retos. Pílulas (border-radius 999px) só em chips de filtro e inputs.
7. Use apenas o português do Brasil. A tagline fica em inglês, como parte da marca.
8. A grafia oficial é **BENZA**. O "benzê" foi descartado por ora.

## 4. As 4 linhas (camada editorial por cima das categorias)

| Linha | Momento | Fundo | Tom | Acento | Foto-chave |
|---|---|---|---|---|---|
| N°1 Penumbra | Ritual noturno | `#260F05` | `#411E0E` | `#E3876A` | couple.jpg |
| N°2 Mata | Sozinha primeiro | `#262505` | `#393709` | `#E3876A` (+ urucum `#E9562E`) | forest.jpg |
| N°3 Rio | Depois / cuidado | `#372B0A` | `#226B8E` | `#86AFC0` | peach.jpg |
| N°4 Brasa | Antes de saber o que vai acontecer | `#2D110F` | `#280D0B` | `#CC8564` (+ terracota `#BA6139`) | redhands.jpg |

Implemente cada linha como tema, aplicando `data-line="mata"` num container. As variáveis estão em `tokens.css`. A página de cada linha, os cards de linha e o selo de linha nos produtos usam esse tema. A referência visual completa está em `reference/Linhas.html`.

## 5. Mapa do site e rotas

```
/                              Home (ver §6)
/categoria/[slug]              Prazer, Cuidado íntimo, No clima, Novidades
/categoria/[slug]/[sub]        subcategoria (ex.: /categoria/prazer/vibradores)
/corpo/[slug]                  Por corpo (clitóris, vulva, … ver taxonomy.json)
/linhas                        índice das 4 linhas
/linhas/[slug]                 página de linha, com o tema da linha
/produto/[slug]                PDP
/approved                      todos os produtos com selo + "como aprovamos"
/ask-benza                     perguntas e respostas (mock)
/diario                        lista de artigos (mock, 3–4 cards)
/sobre                         manifesto
/busca                         busca client-side sobre o JSON
/sacola                        carrinho em estado local (sem checkout; botão "Finalizar" abre aviso de protótipo)
```

A taxonomia completa está em `data/taxonomy.json` e é adaptada da Afterglo: Novidades, Prazer, Cuidado íntimo, No clima e Por corpo, com (Linhas) como camada editorial.

## 6. Home

A home recomendada combina as três variações exploradas:

1. **Barra de aviso** em mono: "Envio discreto para todo o Brasil · embalagem sem marca".
2. **Header** com as categorias à esquerda, o wordmark no centro e Linhas, Ask Benza, busca e "Sacola [n]" à direita. Inclui um **mega menu** que abre no hover e no foco do teclado, com colunas de subcategorias e um card de linha com foto. Referência: `reference/SiteV1.html`, que mostra o menu aberto em "Prazer".
3. **Hero dividido** em texto e foto (V2): "O que está aqui, está aqui *porque a gente escolheu.*", com os CTAs "Comprar agora" e "Fazer o quiz". O quiz pode ser um placeholder.
4. **Índice tipográfico de categorias** (V2): linhas grandes em Cormorant, com as subcategorias ao lado e a contagem `[00]` calculada a partir do JSON.
5. **"Conheça (o seu) corpo"** (V3): grade de partes do corpo que levam a `/corpo/[slug]`.
6. **As 4 linhas** em cards com foto e cor da linha (V2).
7. **Novidades (aprovadas)**: carrossel ou grade de ProductCards com o selo ✓ Approved.
8. **Ask Benza** em bloco coral, com uma pergunta em destaque e um formulário mock (V3).
9. **Footer** com o wordmark, a tagline e as colunas Loja, Linhas e BENZA.

**Comparação de variações:** a home aceita `?v=1`, `?v=2` e `?v=3` para renderizar fielmente cada variação de `reference/SiteV1–3.html`. Sem parâmetro, renderiza a combinação acima. A designer ainda está escolhendo, e esse parâmetro permite comparar ao vivo.

## 7. Componentes

`AnnouncementBar` · `Header` · `MegaMenu` · `MobileNav` (gaveta) · `Wordmark` (escolhe a variante do SVG por fundo) · `Hero` (variantes `photo` | `split` | `collage`) · `CategoryIndex` · `CategoryTiles` · `BodyGrid` · `BodyChips` · `LineCard` · `LineBand` · `LineList` · `ProductCard` · `ApprovedBadge` · `ProductGrid` + `Filters` (categoria, corpo, linha, faixa de preço, só Approved; com estado na URL) · `AskBenza` · `Newsletter` · `Footer` · `CartDrawer`

## 8. PDP (`/produto/[slug]`)

- **Galeria:** usa placeholder com a cor da linha enquanto não houver foto.
- **Informações:** marca, nome em Cormorant, preço em mono, linha (chip com a cor da linha), partes do corpo e "Adicionar à sacola".
- **Review BENZA Approved:** "O que funciona" e "O que não funciona", lado a lado, mais "Testado por [nome] durante [tempo]". Esse é o diferencial da marca e deve ter destaque.
- **Detalhes:** acordeão com material, tamanho e cuidados.
- **Recomendações:** "Combina com", com produtos da mesma linha.

## 9. Responsivo e acessibilidade

- Desenhado para 1440px e precisa funcionar a partir de 360px. No mobile, o gutter é de 16px, os grids empilham e o header vira wordmark + gaveta.
- Use elementos reais (`<a>`, `<button>`, `<input>` com `<label>`), com alvos de toque de no mínimo 44px e foco visível.
- O mega menu precisa ser acessível por teclado e fechar com Esc.
- Contraste de 4.5:1 em texto menor que 24px. Areia sobre os 4 fundos de linha passa; coral sobre fundo claro usa `#A4472A`.
- Use `alt` descritivo em todas as fotos. O conteúdo é sensível, então descreva sem explicitar.

## 10. Conteúdo

- Use os textos que aparecem nos HTMLs de referência.
- Tudo entre colchetes (`[Nome do produto]`, `[PREÇO]`, `[00]`) é placeholder. Mantenha os colchetes visíveis para deixar claro que ainda falta conteúdo, e não invente preços, marcas ou números.

## 11. Pendências (não resolver no código)

- Escolha da plataforma de loja
- Fotos de produto e catálogo real de marcas parceiras
- **Direitos de imagem:** as fotos em `assets/photos/` vêm do moodboard e servem só de referência para o protótipo. Não devem ir para um site público sem licença.
- Textos legais (CNPJ, políticas, termos) e regras de pagamento e anúncio para a categoria sex wellness
- Validação de faixa etária (+18): criar um modal simples de confirmação como placeholder

## 12. Ordem de trabalho sugerida

1. Setup: Next.js, Tailwind, tokens, fontes e assets em `/public`.
2. `Wordmark`, `Header`, `MegaMenu`, `MobileNav` e `Footer`.
3. A home (§6), conferida lado a lado com `reference/`.
4. `ProductCard`, a página de categoria e os filtros.
5. As páginas de linha e de corpo.
6. A PDP e a sacola.
7. Approved, Ask Benza, Diário, Sobre, busca e o modal +18.
8. Revisão de responsividade e de acessibilidade.

Mostre cada etapa rodando (`npm run dev`) antes de seguir.
