# Conteúdo pendente dos cards de projeto

Levantado em 2026-08-11 cruzando `src/app/components/projects/projects.json` (37 cards)
com os repositórios do GitHub (`gh`, conta `AuggieAlmeida` + orgs `Keanus-In-Reevesverse`,
`JavaPadoca`, `KitManeger-Fatec`, `TJG-Tech`) e com as folhas de projeto do vault.

Estado atual: **13 cards com imagem, 13 com demo, 1 com publicação, 0 com link de repositório.**

O campo `githubUrl` existe no componente e está renderizado, mas nenhum card usa. É o
buraco mais barato de fechar: dez repositórios já são públicos.

---

## 1. Repositório público pronto — só ligar `githubUrl`

Verificado por `gh repo list`: todos são `PUBLIC` hoje.

| Card                    | Repositório                                     | Observação                                                                    |
| ----------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `dnd-augury-guide`      | `AuggieAlmeida/DnD-Guide`                       | —                                                                             |
| `pasta-la-vista`        | `AuggieAlmeida/Pasta-la-Vista`                  | —                                                                             |
| `kitbuilder`            | `KitManeger-Fatec/KitBuilder-tkinter`           | existe espelho em `AuggieAlmeida/KitBuilder-tkinter`; escolher um             |
| `youtcatcher`           | `AuggieAlmeida/YoutCatcher`                     | —                                                                             |
| `repo-explorer-angular` | `AuggieAlmeida/repo-explorer`                   | único link já registrado no vault                                             |
| `javafx-pokemon`        | `AuggieAlmeida/JAVAFX-MAVEN-MVC-POKEMONAPP`     | —                                                                             |
| `aquila-e-evelyn`       | `AuggieAlmeida/aquila-e-evelyn`                 | —                                                                             |
| `zoologic`              | `AuggieAlmeida/zoologic-api` + `zoologic-front` | são **dois** repositórios e o card aceita um só                               |
| `omegahub`              | `AuggieAlmeida/discordia`                       | **confirmar** — monorepo Turborepo/TS, bate com o "ex-Discordia" da folha     |
| `buscajogos`            | `Keanus-In-Reevesverse/GamePricesFinder`        | **confirmar** — C#, 2022; a folha diz que o material do repositório se perdeu |

## 2. Repositório existe mas é privado — decisão sua

Tornar público, ou o card fica sem link.

| Card              | Repositório privado                            | Nota                                               |
| ----------------- | ---------------------------------------------- | -------------------------------------------------- |
| `taskforge`       | `AuggieAlmeida/TaskForge`                      | projeto próprio, publicável se quiser              |
| `jarbas`          | `AuggieAlmeida/Jarbas`                         | idem                                               |
| `pokedex`         | `AuggieAlmeida/PokeAPI`                        | idem                                               |
| `brechoapp`       | `AuggieAlmeida/GFC-Brech--ERP`                 | idem                                               |
| `portfolio-suite` | `AuggieAlmeida/portfolio-v2`                   | idem                                               |
| `stechclub`       | `AuggieAlmeida/Stech`                          | código de empresa — não publicar sem aval da Stech |
| `portalaz`        | `AuggieAlmeida/portalAZ`                       | código de cliente — não publicar                   |
| `asurapadel`      | `TJG-Tech/AsuraPadelWeb` + `AsuraPadelManager` | org de cliente — não publicar                      |

## 3. Sem repositório localizado no GitHub

Nenhum repo bate com estes cards. Ou nunca subiram, ou vivem só em disco.

`pronto` · `tecnurg` · `barbearia-app` · `sudoku-solver` · `financeos` ·
`instagram-analyzer` · `jornada5d` · `calc-financeira` · `bubble-box-lavanderia`

`quinto-selo` existe local em `~/Documents/Projetos/quinto-selo` e não tem repositório remoto.

`pronto`, `tecnurg`, `barbearia-app` e `brechoapp` são, pelas folhas, escopo arquitetural —
pode não haver código para linkar, e nesse caso o card precisa deixar isso claro no texto
em vez de aparentar produto entregue.

## 4. Imagens faltando — 24 dos 37 cards

Têm imagem hoje: as nove landings/sites comerciais, `mitra-crm`, `asurapadel`,
`dnd-augury-guide`, `pasta-la-vista`, `zoologic`.

Faltam, em ordem de facilidade:

- **Print direto, produto no ar:** `stechclub` (club.stechsolucoes.com).
- **Você vai fornecer:** `portalaz` (com dados sensíveis da empresa escondidos).
- **Precisa rodar local para capturar:** `taskforge`, `omegahub`, `financeos`, `jarbas`,
  `quinto-selo`, `repo-explorer-angular`, `instagram-analyzer`, `pokedex`, `youtcatcher`,
  `javafx-pokemon`, `sudoku-solver`, `kitbuilder`, `calc-financeira`, `aquila-e-evelyn`.
- **Sem interface própria para capturar:** `pronto`, `tecnurg`, `barbearia-app`,
  `brechoapp`, `buscajogos`, `jornada5d`, `bubble-box-lavanderia`, `portfolio-suite`.

Fallback de iniciais cobre os 24 sem quebrar o layout, então nada aqui é urgente.

Só existe um lote de prints em `raw/` — a pasta `pastalavista+asura+zoologic`, já consumida.

## 5. Demos a resolver

- `aquila-e-evelyn` — GitHub Pages está **configurado** (`auggiealmeida.github.io/aquila-e-evelyn/`)
  mas responde **404**. Falta o deploy. É a demo mais barata de recuperar.
- `dnd-augury-guide` — existem dois deploys vivos do mesmo projeto,
  `auggiealmeida.github.io/DnD-Guide/` (em uso) e `dn-d-guide.vercel.app` (também 200).
  Escolher um e desligar o outro, ou o card fica ambíguo.
- `zoologic` — o repositório `GFC-Brech--ERP` tem `zoo-front-theta.vercel.app` cadastrado
  como homepage, e essa URL responde **404**. Homepage no repositório errado e deploy morto.
- `mitra-crm` — usa o GitHub como `demoUrl`. Deveria ser `githubUrl`, e o card ficaria
  sem demo (que é a verdade).

## 6. Referências e prova

- `kitbuilder` — feito: RIC do Centro Paula Souza, em campo `paperUrl`.
- `Keanus-In-Reevesverse/monografia` é um repositório privado de monografia. Se essa
  monografia também estiver publicada no RIC, o projeto correspondente ganha `paperUrl`.
- `asurapadel` — a descrição afirma queda de 800 ms para 220 ms. A folha do vault registra
  o número como auto-relatado, **sem medição anexada**. Ou anexa a medição, ou o número sai.
- Hero ainda diz "20 Projetos Concluídos" com 37 cards na página.

## 7. Repositórios públicos que não estão no portfólio

Candidatos reais:

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

## 8. Fora do portfólio de propósito

Não entram sem sua decisão explícita:

- `srim` — a folha carrega a tag `confidencial`.
- `vertc-lastros` — suíte de cliente, anonimizada como "suíte financeira B2B" até no LinkedIn.
- `valentine-love-landing` — presente pessoal; está no ar em `valentine-love-landing.vercel.app`.
- `dev-grupo-az.web.app` — ambiente de desenvolvimento do cliente do PortalAZ, registrado
  na folha do projeto. Não é demo pública e não deve virar link no site.
