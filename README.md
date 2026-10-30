# LuxSmart — poste inteligente

![LuxSmart: a rua que acende quando você passa](public/og-image.png)

Site de apresentação do **LuxSmart**, projeto acadêmico de Ciência da Computação (UNIMAX): um poste de
iluminação pública que

- **de dia** fica **desligado** (sensor de luminosidade);
- **à noite, sem movimento**, fica **dimerizado** (30% da potência);
- **com carro ou pedestre por perto**, acende a **100%** e volta ao modo econômico alguns
  segundos depois que o movimento acaba.

O objetivo é reduzir o custo de energia da iluminação pública sem perder segurança, usando
**Indaiatuba – SP** como cidade de referência.

## Protótipo (maquete)

A demonstração física é uma **maquete em escala**, em que **LEDs representam os postes**.

| Componente                                         | Função                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------- |
| Sensor de luminosidade LDR                         | Identificar a condição de dia ou noite                                    |
| Sensor de presença PIR e/ou HC-SR04 (ultrassônico) | Detectar pedestres ou veículos no trecho monitorado                       |
| ESP32                                              | Ler os sensores, aplicar a lógica dos modos e comandar a iluminação       |
| LEDs                                               | Representar os postes da maquete                                          |
| PWM                                                | Controlar a intensidade luminosa e permitir a transição entre os modos    |
| Wi-Fi _(previsto)_                                 | Recurso previsto para comunicação futura, caso seja incorporado ao escopo |

Fluxo: LDR + (PIR / HC-SR04) → ESP32 → PWM → LEDs. O Wi-Fi é uma evolução futura, fora do
fluxo atual.

## Seções do site

Uma página curta, com 6 seções:

| #   | Seção                  | O que mostra                                                                                                                |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | Início                 | "LuxSmart", uma frase e o botão para os resultados. Um carro passa e os postes acendem: 3D no desktop, 2D (CSS) no celular. |
| 2   | O problema e a solução | Postes a 100% em ruas vazias, 3 números (pontos em LED, % já em LED, economia estimada), a solução e os benefícios.         |
| 3   | Como funciona          | 3 cards (Dia, Noite sem movimento, Movimento) e a linha LDR + PIR/HC-SR04 → ESP32 → PWM → LEDs, com a função de cada um.    |
| 4   | Resultados             | 4 indicadores para Indaiatuba (energia, R$, % e CO₂ economizados por ano) e o gráfico de barras dos 3 cenários.             |
| 5   | Simule a economia      | Rua com 5 postes que reagem ao toque e um slider de movimento: "Economia de X% ≈ R$ Y por ano em Indaiatuba".               |
| 6   | Equipe                 | Integrantes por área de atuação, com avatares de iniciais.                                                                  |

O rodapé tem o acordeão **"Como calculamos?"**: fórmulas resumidas e todos os dados de referência,
com valor, situação e fonte.

> **Números honestos:** todo valor que não é um fato publicado aparece no site com o selo
> **≈ estimativa** (ou **≈ a verificar**) e é explicado no "Como calculamos?".

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- Tailwind CSS 4 (tokens de cor e fonte em `src/index.css`)
- Framer Motion (animações) + Lenis (scroll suave)
- React Three Fiber (cena 3D do início, só no desktop)
- react-countup (números animados); o gráfico de barras é feito em HTML/CSS
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

Todos os textos variáveis e números ficam em `src/data/`. Os componentes e o gráfico se
atualizam sozinhos.

| Arquivo                   | O que muda                                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/data/indaiatuba.ts`  | **Dados de referência**: pontos de LED, horas por noite, tarifa, fator de CO₂, dimerização, custo do kit, potências e movimento por tipo de via, perfil de movimento da noite. |
| `src/data/hardware.ts`    | Componentes do protótipo (LDR, PIR/HC-SR04, ESP32, LEDs, PWM e Wi-Fi previsto), função, status e a nota sobre a maquete.                                                       |
| `src/data/etapas.ts`      | Os 3 modos do poste (título, resumo, frase e ícone).                                                                                                                           |
| `src/data/equipe.ts`      | Áreas da equipe e integrantes (nome; `foto`, `github` e `linkedin` opcionais).                                                                                                 |
| `src/data/beneficios.ts`  | Chips de benefícios (marque `previsto` no que ainda depende do futuro).                                                                                                        |
| `src/data/calculadora.ts` | Limites do slider de movimento (e exemplo usado nos testes).                                                                                                                   |
| `src/data/simulador.ts`   | Quantidade de postes, raio do sensor, tempo de espera e velocidades da rua do "Simule".                                                                                        |
| `src/data/site.ts`        | Curso, instituição, ano e link do repositório.                                                                                                                                 |

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
reais por tipo de via, custo real do kit e medições de movimento da maquete.

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

| Arquivo                          | Responsabilidade                                                                  |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `src/lib/energy.ts`              | Consumo, fator de uso, custo, CO₂, payback, cenários e série mensal               |
| `src/lib/nightProfile.ts`        | Potência hora a hora numa noite típica (não exibida na página; mantida e testada) |
| `src/lib/indaiatubaScenarios.ts` | Liga os dados de Indaiatuba às funções (por via e cidade toda)                    |
| `src/lib/calculator.ts`          | "Simule": "poste médio" da cidade e ajuste do valor do slider                     |
| `src/lib/simulation.ts`          | Regra dos postes (detecção, espera, rampas) — usada no "Simule" e no 3D           |
| `src/lib/format.ts`              | Formatação pt-BR (moeda, energia, horas, percentuais)                             |

## Estrutura de pastas

```
├── public/               favicon, imagem de compartilhamento, robots.txt
├── scripts/              geração das imagens estáticas (sharp)
├── src/
│   ├── components/       UI reutilizável (botões, sliders, selos, ícones, layout, ilustrações SVG)
│   ├── data/             ⭐ dados e textos editáveis (veja a tabela acima)
│   ├── hooks/            hooks (scroll, media queries, seção ativa, ociosidade)
│   ├── lib/              lógica pura + testes (*.test.ts)
│   ├── sections/         as 6 seções (Hero, ProblemSolution, HowItWorks, Results, Simulate, Team)
│   ├── three/            cena 3D do início (React Three Fiber, só no desktop)
│   ├── test/             configuração dos testes de componente
│   ├── App.tsx           ordem das seções
│   └── index.css         design system (cores, fontes, brilho) com Tailwind 4
├── .github/workflows/    CI: formatação, lint, testes e build a cada push
└── vercel.json           configuração da Vercel
```

## Qualidade

- **Testes:** 98 testes (Vitest) — lógica de energia com casos-limite (0% e 100% de movimento,
  dimerização 0 e 1), perfil noturno, simulação, formatação, dados da equipe e do hardware e testes
  de componente (equipe, linha de componentes, "Simule" e "Como calculamos?").
- **Acessibilidade:** HTML semântico, navegação por teclado com foco visível, link "pular para o
  conteúdo", `aria-valuetext` no slider, barras do gráfico com nome e valor em texto, anúncios
  para leitores de tela com debounce, contraste AA (amarelo só como fundo/destaque sobre claro).
  Auditoria com axe-core: 0 violações (375 e 1440 px).
- **Mobile first:** texto corrido com no mínimo 16 px (títulos fluidos com `clamp()`), áreas de toque
  de pelo menos 44 × 44 px, cartões de função que abrem e fecham com toque. Verificado em 360,
  375, 414, 768, 1024 e 1440 px, sem rolagem horizontal.
- **Movimento reduzido:** com `prefers-reduced-motion`, o 3D não é carregado, o scroll suave e as
  animações contínuas são desligados e a rua do início fica parada.
- **Performance:** no celular não há Three.js — a rua do início é animada só com CSS. No desktop, a
  cena 3D é baixada com o navegador ocioso e pausa fora da tela. Fontes críticas com preload.
  Lighthouse medido localmente no build de produção: celular 98 · 100 · 100 · 100 e desktop
  99 · 100 · 100 · 100 (Performance · Acessibilidade · Boas práticas · SEO), CLS 0.

## Deploy

O site é publicado pela **Vercel**:

1. Importe o repositório em [vercel.com/new](https://vercel.com/new) — o preset **Vite** é detectado
   e o `vercel.json` já define build e pasta de saída.
2. Depois do primeiro deploy, em _Settings → Environment Variables_, defina `SITE_URL` com a URL
   final (ex.: `https://luxsmart.vercel.app`) e faça _Redeploy_, para as imagens de
   compartilhamento usarem URL absoluta.
3. Cada push na `main` publica automaticamente.

### Integração contínua

O workflow `.github/workflows/ci.yml` roda a cada push e pull request: `npm run format:check`,
`npm run lint`, `npm test` e `npm run build`. Ele não publica nada — só mostra ✓ ou ✗ no GitHub.

Para publicar em outro lugar com subdiretório (ex.: GitHub Pages em
`https://<usuário>.github.io/luxsmart/`), basta gerar o build com `BASE_PATH=/luxsmart/`.

### Variáveis de build (opcionais)

| Variável    | Uso                                                              | Padrão |
| ----------- | ---------------------------------------------------------------- | ------ |
| `SITE_URL`  | URL pública, sem barra final — link canônico e imagem Open Graph | vazio  |
| `BASE_PATH` | Subdiretório de publicação (ex.: `/luxsmart/` no GitHub Pages)   | `/`    |

Podem ser definidas no shell, no painel da Vercel ou em um arquivo `.env` (veja `.env.example`).

## Decisões técnicas

- **Uma regra de poste para tudo:** o "Simule" e a cena 3D usam a mesma função (`atualizarPoste`),
  então o comportamento mostrado é sempre o mesmo e está coberto por testes.
- **Rua do início sem JavaScript de animação:** o carro e os postes são sincronizados só com CSS
  (cada poste usa o mesmo ciclo, atrasado pelo instante em que o carro chega).
- **Luz "falsa" no 3D:** cones e poças com mistura aditiva em vez de luzes dinâmicas, com resolução
  limitada — visual estilizado sem pesar.
- **Gráfico em HTML/CSS:** 3 barras não justificam uma biblioteca de gráficos; a paleta foi
  validada para daltonismo e contraste sobre fundo escuro, e cada barra tem nome e valor em texto.
- **"Simule" coerente com os Resultados:** o slider começa no movimento médio da cidade ("poste
  médio": potência média e movimento ponderado pela energia), que reproduz exatamente os totais da
  seção Resultados.

---

Projeto acadêmico · Ciência da Computação · UNIMAX · Indaiatuba – SP · 2026
