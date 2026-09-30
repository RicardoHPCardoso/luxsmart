# LuxSmart — poste inteligente

![LuxSmart: a rua que acende quando você passa](public/og-image.png)

Site de apresentação do **LuxSmart**, projeto acadêmico de Ciência da Computação: um poste de
iluminação pública que

- **de dia** fica **desligado** (sensor de luminosidade);
- **à noite, sem movimento**, fica **dimerizado** (30% da potência);
- **com carro ou pedestre por perto**, acende a **100%** e volta ao modo econômico alguns
  segundos depois que o movimento acaba.

O objetivo é reduzir o custo de energia da iluminação pública sem perder segurança, usando
**Indaiatuba – SP** como cidade de referência.

## Seções do site

| #   | Seção                  | O que mostra                                                                                              |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | Hero 3D                | Rua noturna low-poly; um carro passa e os postes acendem em sequência. Interruptor Dia/Noite.             |
| 2   | O problema             | Números animados sobre a rede de Indaiatuba e a ilustração "energia paga para iluminar ninguém".          |
| 3   | Como funciona          | Seção fixa guiada pelo scroll: Dia → Noite sem movimento → Movimento, com diagrama de sinais do hardware. |
| 4   | Simulador              | Rua 2D com 8 postes: envie carros e pedestres ou clique na rua; medidor de consumo instantâneo.           |
| 5   | Dashboard · Indaiatuba | KPIs e gráficos (3 cenários, consumo acumulado, potência numa noite típica) com filtro por tipo de via.   |
| 6   | Calculadora            | Sliders de postes, potência, movimento, dimerização, tarifa e custo do kit; botão "Aplicar à cidade".     |
| 7   | Benefícios             | Economia, segurança, poluição luminosa, vida útil, dados para a prefeitura, ODS 7 e 11.                   |
| 8   | Roadmap                | Pesquisa → protótipo → testes → piloto em uma rua → expansão.                                             |
| 9   | Equipe                 | Cards dos integrantes.                                                                                    |
| 10  | Metodologia e fontes   | Fórmulas, premissas e a tabela com todos os dados de referência, fontes e situação de cada um.            |

> **Números honestos:** todo valor que não é um fato publicado aparece no site com o selo
> **≈ estimativa** (ou **≈ a verificar**) e é explicado na seção "Metodologia e fontes".

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- Tailwind CSS 4 (tokens de cor e fonte em `src/index.css`)
- Framer Motion (animações) + Lenis (scroll suave)
- React Three Fiber + drei (cena 3D)
- Recharts (gráficos) + react-countup (números animados)
- Vitest + Testing Library, ESLint, Prettier

## Como rodar

Requisitos: **Node.js 20.19+** (ou 22.12+) e npm.

```bash
npm install
npm run dev        # abre em http://localhost:5173
```

| Comando                 | O que faz                                                    |
| ----------------------- | ------------------------------------------------------------ |
| `npm run dev`           | Servidor de desenvolvimento com recarga automática           |
| `npm run build`         | Checagem de tipos + build de produção em `dist/`             |
| `npm run preview`       | Serve o build de produção localmente (http://localhost:4173) |
| `npm test`              | Roda os testes (Vitest)                                      |
| `npm run lint`          | ESLint                                                       |
| `npm run format`        | Formata o código com Prettier                                |
| `npm run gerar:imagens` | Regera `public/og-image.png` e `public/apple-touch-icon.png` |

## Onde editar os dados

Todos os textos variáveis e números ficam em `src/data/`. Os componentes e gráficos se
atualizam sozinhos.

| Arquivo                   | O que muda                                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/data/indaiatuba.ts`  | **Dados de referência**: pontos de LED, horas por noite, tarifa, fator de CO₂, dimerização, custo do kit, potências e movimento por tipo de via, perfil de movimento da noite. |
| `src/data/hardware.ts`    | Nomes e modelos dos componentes (sensores, microcontrolador, driver, luminária) do diagrama.                                                                                   |
| `src/data/etapas.ts`      | Textos dos 3 estados do poste.                                                                                                                                                 |
| `src/data/equipe.ts`      | Integrantes (nome, função, foto opcional em `public/equipe/`, link).                                                                                                           |
| `src/data/roadmap.ts`     | Etapas do roadmap, período e status.                                                                                                                                           |
| `src/data/beneficios.ts`  | Cards de benefícios.                                                                                                                                                           |
| `src/data/calculadora.ts` | Limites dos sliders e exemplo inicial da calculadora.                                                                                                                          |
| `src/data/simulador.ts`   | Raio do sensor, tempo de espera, velocidades e rampas do simulador.                                                                                                            |
| `src/data/site.ts`        | Nome da instituição, ano, link do repositório.                                                                                                                                 |

Cada dado de referência tem `valor`, `unidade`, `fonte`, `observacao` e `status`:

| `status`      | Significado                                   | Selo no site  |
| ------------- | --------------------------------------------- | ------------- |
| `fonte`       | Publicado por fonte identificada              | (sem selo)    |
| `estimativa`  | Calculado a partir de outros dados            | ≈ estimativa  |
| `hipotese`    | Premissa do projeto, ainda sem medição        | ≈ estimativa  |
| `placeholder` | Valor provisório, a substituir                | ≈ estimativa  |
| `verificar`   | Referência que precisa ser conferida na fonte | ≈ a verificar |

**Pendências para o grupo** (marcadas no próprio arquivo): tarifa B4a vigente da distribuidora,
fator de emissão atual do MCTI, confirmação das 11h52min na regulamentação da ANEEL, potências
reais por tipo de via, custo real do kit e medições de movimento do protótipo.

## Como os números são calculados

A lógica fica em funções puras e testadas em `src/lib/`:

```
consumo (kWh/ano) = pontos × potência (kW) × horas por noite × 365 × fator de uso
fator LuxSmart    = (1 − movimento) × dimerização + movimento
custo (R$/ano)    = kWh × tarifa
CO₂ evitado (t)   = kWh economizados × fator de emissão (kg/kWh) ÷ 1000
payback (anos)    = pontos × custo do kit ÷ economia anual (R$)
```

Exemplo: 20% de movimento e 30% de dimerização → fator 0,44 → **56% de economia** sobre o LED
atual. A economia é calculada contra o LED atual (o kit é instalado sobre luminárias existentes);
o vapor de sódio aparece só como referência histórica.

| Arquivo                          | Responsabilidade                                                         |
| -------------------------------- | ------------------------------------------------------------------------ |
| `src/lib/energy.ts`              | Consumo, fator de uso, custo, CO₂, payback, cenários e série mensal      |
| `src/lib/nightProfile.ts`        | Potência hora a hora numa noite típica (mesma média do cálculo anual)    |
| `src/lib/indaiatubaScenarios.ts` | Liga os dados de Indaiatuba às funções (por via e cidade toda)           |
| `src/lib/calculator.ts`          | Calculadora, "poste médio" da cidade e escala logarítmica do slider      |
| `src/lib/simulation.ts`          | Regra dos postes (detecção, espera, rampas) — usada no simulador e no 3D |
| `src/lib/format.ts`              | Formatação pt-BR (moeda, energia, horas, percentuais)                    |

## Estrutura de pastas

```
├── public/               favicon, imagem de compartilhamento, robots.txt
├── scripts/              geração das imagens estáticas (sharp)
├── src/
│   ├── components/       UI reutilizável (botões, sliders, selos, ícones, layout, ilustrações SVG)
│   ├── data/             ⭐ dados e textos editáveis (veja a tabela acima)
│   ├── hooks/            hooks (scroll, media queries, visibilidade, modo dia/noite)
│   ├── lib/              lógica pura + testes (*.test.ts)
│   ├── sections/         as seções da página (Hero, Problem, HowItWorks, Simulator, Dashboard…)
│   ├── three/            cena 3D do hero (React Three Fiber)
│   ├── test/             configuração dos testes de componente
│   ├── App.tsx           ordem das seções
│   └── index.css         design system (cores, fontes, brilho) com Tailwind 4
├── .github/workflows/    deploy automático no GitHub Pages
└── vercel.json           configuração da Vercel
```

## Qualidade

- **Testes:** 80 testes (Vitest) — lógica de energia com casos-limite (0% e 100% de movimento,
  dimerização 0 e 1), perfil noturno, simulação, formatação e testes de componente da calculadora.
- **Acessibilidade:** HTML semântico, navegação por teclado com foco visível, link "pular para o
  conteúdo", `aria-label`/`aria-valuetext` nos controles, tabela de dados para cada gráfico, anúncios
  para leitores de tela com debounce, contraste AA (amarelo só como fundo/destaque sobre claro).
  Auditoria com axe-core: 0 violações (desktop e 375 px).
- **Movimento reduzido:** com `prefers-reduced-motion`, o 3D não é carregado, o scroll suave, o
  parallax e as animações contínuas são desligados e "Como funciona" vira uma lista estática.
- **Performance:** a cena 3D (three.js) e os gráficos (Recharts) são carregados sob demanda; o 3D
  só em telas ≥ 768 px, com o navegador ocioso, e pausa fora da tela. Fontes críticas com preload.
  Lighthouse medido localmente no build de produção: celular 96 · 100 · 100 · 100 e desktop
  99 · 100 · 100 · 100 (Performance · Acessibilidade · Boas práticas · SEO), CLS 0.
- **Responsivo:** testado em 375, 768 e 1440 px.

## Deploy

### Vercel (recomendado)

1. Importe o repositório em [vercel.com/new](https://vercel.com/new) — o preset **Vite** é detectado.
2. Em _Settings → Environment Variables_, defina `SITE_URL` com a URL final
   (ex.: `https://luxsmart.vercel.app`) para as imagens de compartilhamento usarem URL absoluta.
3. Cada push na `main` publica automaticamente.

### GitHub Pages

1. Em _Settings → Pages_, escolha **Source: GitHub Actions**.
2. Faça push na `main`: o workflow `.github/workflows/deploy-pages.yml` roda lint, testes e build
   (com `BASE_PATH=/<repositório>/`) e publica em `https://<usuário>.github.io/<repositório>/`.

### Variáveis de build (opcionais)

| Variável    | Uso                                                              | Padrão |
| ----------- | ---------------------------------------------------------------- | ------ |
| `SITE_URL`  | URL pública, sem barra final — link canônico e imagem Open Graph | vazio  |
| `BASE_PATH` | Subdiretório de publicação (ex.: `/luxsmart/` no GitHub Pages)   | `/`    |

Podem ser definidas no shell, no painel da Vercel ou em um arquivo `.env` (veja `.env.example`).

## Decisões técnicas

- **Uma regra de poste para tudo:** o simulador 2D e a cena 3D usam a mesma função
  (`atualizarPoste`), então o comportamento mostrado é sempre o mesmo e está coberto por testes.
- **Luz "falsa" no 3D:** cones e poças com mistura aditiva em vez de luzes dinâmicas — visual
  estilizado a 60 fps; o `PerformanceMonitor` reduz a resolução se o FPS cair.
- **Paleta dos gráficos validada** para daltonismo e contraste sobre a superfície escura; toda série
  tem legenda, rótulo direto e tabela, então a cor nunca é o único meio de identificação.
- **Calculadora coerente com o dashboard:** "Aplicar à cidade" usa um "poste médio" (potência média
  e movimento ponderado pela energia) que reproduz exatamente os totais do dashboard.

---

Projeto acadêmico · Ciência da Computação · Indaiatuba – SP · 2026
