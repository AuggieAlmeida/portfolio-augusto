# Conteúdo pendente dos cards de projeto

Levantado em 2026-08-11 cruzando `src/app/components/projects/projects.json` com os
repositórios do GitHub (`gh`, conta `AuggieAlmeida` + orgs `Keanus-In-Reevesverse`,
`JavaPadoca`, `KitManeger-Fatec`, `TJG-Tech`) e com as folhas de projeto do vault.

Estado atual, **36 cards**: 24 com imagem, 14 com demo, 9 com repositório, 1 com publicação.

O gargalo agora é imagem. Dos 12 que faltam, 5 só fecham rodando o projeto e
capturando a tela; três não têm interface própria e quatro ficam sem imagem por
confidencialidade.

---

## 1. Imagens faltando — 12 dos 36 cards

Precisam rodar localmente, um a um:

`omegahub` · `pokedex` · `javafx-pokemon` · `sudoku-solver` · `kitbuilder`

Fechado nesta rodada:

- `repo-explorer-angular` — captura 1280×720 em 2026-08-12, com busca pública por `angular`,
  lista de resultados e painel de detalhe aberto; integrada ao card e validada no modal.
- `instagram-analyzer` — janela nativa 1066×768 em estado vazio, sem export real do Instagram;
  mostra seleção dos dois JSONs, ação de análise, abas e tema escuro.
- `quinto-selo` — viewport nativo 480×302 da fatia jogável em modo host com bot; sem upscale e
  sem fingir arte que o projeto ainda não tem.
- `taskforge` — interface Next/Tauri em modo web, 1280×720, com navegação de planos,
  execuções, falhas, rascunhos, repositório e chat read-only.
- `financeos` — login público limpo, sem o hint que expunha a credencial de desenvolvimento;
  captura 1280×720 integrada após a remoção estreita do bloco.
- `youtcatcher` — app macOS temporário gerado com PyInstaller e perfil vazio; captura 871×768
  sem reaproveitar o histórico local.
- `calc-financeira` — dashboard desktop em tela cheia, com os quatro métodos de divisão de
  renda e os gráficos comparativos visíveis.
- `jarbas` — onboarding web seguro do Drifter, sem conectar a interface ao vault pessoal.
- `aquila-e-evelyn` — quatro capturas sanitizadas (hero, experiência, sistema visual e
  versão mobile), sem depoimentos, fotos pessoais, endereço, data, RSVP ou presentes.

Bloqueios resolvidos nesta rodada:

- `financeos` — credencial de desenvolvimento removida da UI; captura segura publicada.
- `youtcatcher` — o processo Python cru continuou invisível à acessibilidade, mas um bundle
  macOS temporário registrou a janela corretamente e permitiu a captura com perfil vazio.

Bloqueio local remanescente:

- `sudoku-solver` — o solver em C passa (`Solver OK`), porém o pipeline visual não compila sem
  OpenCV e o checkout local não contém `assets/samples/` nem templates OCR. A captura depende
  de recuperar esses artefatos no repositório remoto.

Fase GitHub iniciada em 2026-08-12:

- `kitbuilder` — `KitManeger-Fatec/KitBuilder-tkinter` recuperado e indexado; app abre a tela
  de login. A suíte fica em 13 passed/2 failed sem MySQL local e há dívida de segurança no
  log de falha de autenticação. Captura adiada pela perda de bootstrap do Computer Use.
- `javafx-pokemon` — `AuggieAlmeida/JAVAFX-MAVEN-MVC-POKEMONAPP` recuperado e indexado;
  Maven test passa e a tela de login abre, embora tente MySQL local imediatamente. Captura
  adiada pelo mesmo bloqueio de automação.
- `aquila-e-evelyn` — repositório público recuperado, sanitizado e indexado; a versão
  original ficou preservada em branch própria antes da remoção do conteúdo pessoal.
- `pokedex` — origem correta confirmada pelo Augusto em
  `Gabriel-AFerreira/testepokedexdozero`. O histórico foi preservado, o wrapper
  `projetoTeste/` promovido à raiz e o projeto publicado em `AuggieAlmeida/Pokedex`.
  TypeScript passa; a captura do app Expo ainda falta.

Além do Sudoku, `omegahub` continua dependendo de confirmação do casamento com `discordia`.

Sem interface própria para capturar — o card pode ficar no fallback de iniciais para sempre:

`pronto` · `barbearia-app` · `buscajogos`

Sem imagem **por decisão**, e não por falta — case sob confidencialidade, publicado só como
texto: `portal-agente-ia` · `suite-financeira-b2b` · `portal-remuneracao-frota` ·
`servidor-llm-local`.

O fallback de iniciais cobre todos sem quebrar o layout, então nada aqui bloqueia deploy.

### Segundas imagens pendentes de decisão sua

O modal aceita galeria (campo `images`). Duas capturas já existem em `raw/` e **não** foram
publicadas porque expõem mais do que o card precisa:

- **AsuraPadel, tela de dashboard** — mostra o card do usuário administrador com nome e
  e-mail no rodapé da sidebar. Publicada hoje só a tela de login.
- **StechClub, área logada** — mostra a home do aluno com nome dos instrutores e miniaturas
  de gravação com o rosto de colegas. Publicada hoje só a home pública.

A captura de dashboard do AsuraPadel continua fora: ela exibe nome e e-mail de administrador.
Em contrapartida, duas telas de login sem dados reais foram integradas ao carrossel.

Carrosséis seguros fechados nesta rodada:

- `aquila-e-evelyn` — quatro telas;
- `asurapadel` — três telas públicas/de login, sem dashboard identificado;
- `bubble-box-lavanderia` — duas telas públicas;
- `zoologic` — quatro telas sem a tela de colaboradores, que continha nomes;
- `pasta-la-vista` — quatro telas mobile/web já existentes e mantidas.

## 2. Repositório existe mas é privado — decisão sua

| Card               | Repositório privado                            | Nota                                               |
| ------------------ | ---------------------------------------------- | -------------------------------------------------- |
| `taskforge`        | `AuggieAlmeida/TaskForge`                      | projeto próprio, publicável se quiser              |
| `jarbas`           | `AuggieAlmeida/Jarbas`                         | idem                                               |
| `stechclub`        | `AuggieAlmeida/Stech`                          | código de empresa — não publicar sem aval da Stech |
| `portal-agente-ia` | `AuggieAlmeida/portalAZ`                       | código de cliente — não publicar                   |
| `asurapadel`       | `TJG-Tech/AsuraPadelWeb` + `AsuraPadelManager` | org de cliente — não publicar                      |

## 3. Sem repositório localizado no GitHub

`pronto` · `barbearia-app` · `sudoku-solver` · `financeos` ·
`instagram-analyzer` · `calc-financeira` · `bubble-box-lavanderia`

`quinto-selo` existe local em `~/Documents/Projetos/quinto-selo` e não tem remoto.

`pronto` e `tecnurg` foram consolidados após correção do Augusto: são duas fases do mesmo
projeto, não dois cards. O card único descreve o MVP Pronto e sua evolução arquitetural
Tecnurg. `barbearia-app` permanece como escopo arquitetural sem código localizado.

## 4. Confirmações pendentes de mapeamento

Dois cards ficaram sem `githubUrl` porque o casamento com o repositório não é certo:

- `omegahub` → `AuggieAlmeida/discordia`. Monorepo Turborepo/TypeScript, bate com o
  "ex-Discordia" registrado na folha. Falta seu ok.
- `buscajogos` → `Keanus-In-Reevesverse/GamePricesFinder`. C#, 2022. A folha diz que o
  material do repositório se perdeu, então o casamento é por inferência.

## 5. Demos

Resolvido nesta rodada:

- `dnd-augury-guide` passou a apontar para `dn-d-guide.vercel.app`.
- `mitra-crm` saiu de `demoUrl` para `githubUrl` — o link sempre foi o repositório.
- `bubble-box-lavanderia` ganhou `bubblebox.com.br`.
- `zoologic` fica sem demo: não há deploy vivo. A homepage `zoo-front-theta.vercel.app`
  está cadastrada no repositório errado (`GFC-Brech--ERP`) e responde 404.

### Diagnóstico do aquila-e-evelyn

O CNAME **não** é a causa. Já foi removido: a API do Pages reporta `cname: null` e não há
arquivo `CNAME` no repositório. A URL também não redireciona para o ddns — responde um 404
próprio do GitHub.

A causa real é o build de 11/08 23:53 UTC, que falhou dentro do `actions/deploy-pages@v5`:

```
##[error]Creating Pages deployment failed
##[error]HttpError: self-signed certificate; if the root CA is installed locally,
try running Node.js with --use-system-ca
```

Erro de infraestrutura do GitHub na chamada de API, não do projeto. O build anterior, cinco
minutos antes, tinha subido normalmente. O efeito colateral é que o Pages ficou travado em
`status: building`, e é isso que devolve 404.

Correção: reexecutar o workflow.

```bash
gh run rerun --failed -R AuggieAlmeida/aquila-e-evelyn
```

## 6. Referências e prova

- `kitbuilder` — feito: RIC do Centro Paula Souza, em `paperUrl`.
- `Keanus-In-Reevesverse/monografia` é repositório privado de monografia. Se estiver
  publicada no RIC, o projeto correspondente ganha `paperUrl`.
- `asurapadel` — a descrição afirma queda de 800 ms para 220 ms. A folha do vault registra
  o número como auto-relatado, **sem medição anexada**. Ou anexa a medição, ou o número sai.
- Hero passou de "20" para **32 Projetos Concluídos**, contado card a card contra as folhas
  do vault e descontando a duplicação Pronto/Tecnurg. Ficam de fora os quatro que não estão `concluido`: `portal-remuneracao-frota`
  (ativo), `servidor-llm-local` (pausado), `jarbas` e `quinto-selo` (ativos). O número volta
  a sair do lugar quando algum desses quatro fechar — recontar, não incrementar às cegas.

## 7. Repositórios públicos que não estão no portfólio

| Repositório                                | Sinal                                     |
| ------------------------------------------ | ----------------------------------------- |
| `AuggieAlmeida/mtgsite`                    | deploy vivo em `mtgsite.vercel.app` (200) |
| `AuggieAlmeida/Trip-Agency`                | —                                         |
| `AuggieAlmeida/LDDM-reactnative`           | mobile, disciplina da Fatec               |
| `AuggieAlmeida/RN-trixProject`             | React Native, 2026                        |
| `AuggieAlmeida/app_list_produtos`          | —                                         |
| `KitManeger-Fatec/SAORI_React`             | frente React do time do KitBuilder        |
| `JavaPadoca/PadocaBackend`                 | —                                         |
| `Keanus-In-Reevesverse/alert-price-worker` | worker do GamePricesFinder                |

Descartados como exercício, não portfólio: `C_Studies`, `JS-Scripts`, `Java-OO`,
`git-pratica`, `TestesUnitarios`, `batch`, `tkinter-test`, `project`, `projeto_cicd`,
`API_CICD_1509`, `AppContatos-Auth`, `CriptografiaPython`, `Kotlin_Firebase_App`,
`TopdownShooterC-Sharp`.

## 8. Fora da listagem

Removidos em 2026-08-11 a seu pedido: `brechoapp` (GFC-Brech--ERP), `portfolio-suite`
(portfolio-v2) e `jornada5d`. Outros ainda vão sair.

Entraram em 2026-08-12 como case anonimizado, sem nome de cliente, repositório, URL ou
captura: `vertc-lastros` (Suíte financeira B2B), `grupoaz-portal` (Portal de remuneração e
frota) e `servidor-stech-llm` (Servidor de LLM local). O card do agente de IA foi renomeado
de `portalaz` para `portal-agente-ia` pelo mesmo motivo: os dois sistemas são do mesmo
cliente, e o nome antigo o identificava.

Não entram sem decisão explícita sua:

- `srim` — a folha carrega a tag `confidencial`, está `ativo` e a fonte é roadmap, ficha
  técnica e **cotação**: material de proposta em negociação, não case entregue.
- `valentine-love-landing` — presente pessoal; está no ar em `valentine-love-landing.vercel.app`.
- `dev-grupo-az.web.app` — ambiente de desenvolvimento do cliente dos dois portais, registrado na
  folha do projeto. Não é demo pública e não deve virar link no site.
