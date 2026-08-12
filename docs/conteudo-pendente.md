# Conteúdo pendente dos cards de projeto

Levantado em 2026-08-11 cruzando `src/app/components/projects/projects.json` com os
repositórios do GitHub (`gh`, conta `AuggieAlmeida` + orgs `Keanus-In-Reevesverse`,
`JavaPadoca`, `KitManeger-Fatec`, `TJG-Tech`) e com as folhas de projeto do vault.

Estado atual, **37 cards**: 15 com imagem, 13 com demo, 9 com repositório, 1 com publicação.

O gargalo agora é imagem. Dos 22 que faltam, 17 só fecham rodando o projeto localmente e
capturando a tela; os outros cinco ficam sem imagem por decisão, não por falta.

---

## 1. Imagens faltando — 22 dos 37 cards

Precisam rodar localmente, um a um:

`taskforge` · `omegahub` · `financeos` · `jarbas` · `quinto-selo` · `repo-explorer-angular` ·
`instagram-analyzer` · `pokedex` · `youtcatcher` · `javafx-pokemon` · `sudoku-solver` ·
`kitbuilder` · `calc-financeira` · `aquila-e-evelyn`

Sem interface própria para capturar — o card pode ficar no fallback de iniciais para sempre:

`pronto` · `tecnurg` · `barbearia-app` · `buscajogos`

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

Ambas entram na galeria assim que você confirmar.

## 2. Repositório existe mas é privado — decisão sua

| Card               | Repositório privado                            | Nota                                               |
| ------------------ | ---------------------------------------------- | -------------------------------------------------- |
| `taskforge`        | `AuggieAlmeida/TaskForge`                      | projeto próprio, publicável se quiser              |
| `jarbas`           | `AuggieAlmeida/Jarbas`                         | idem                                               |
| `pokedex`          | `AuggieAlmeida/PokeAPI`                        | idem                                               |
| `stechclub`        | `AuggieAlmeida/Stech`                          | código de empresa — não publicar sem aval da Stech |
| `portal-agente-ia` | `AuggieAlmeida/portalAZ`                       | código de cliente — não publicar                   |
| `asurapadel`       | `TJG-Tech/AsuraPadelWeb` + `AsuraPadelManager` | org de cliente — não publicar                      |

## 3. Sem repositório localizado no GitHub

`pronto` · `tecnurg` · `barbearia-app` · `sudoku-solver` · `financeos` ·
`instagram-analyzer` · `calc-financeira` · `bubble-box-lavanderia`

`quinto-selo` existe local em `~/Documents/Projetos/quinto-selo` e não tem remoto.

`pronto`, `tecnurg` e `barbearia-app` são, pelas folhas, escopo arquitetural — pode não
haver código para linkar, e nesse caso o texto do card precisa deixar isso claro em vez de
aparentar produto entregue.

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

Aberto:

- `aquila-e-evelyn` — ver abaixo.

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
- Hero passou de "20" para **33 Projetos Concluídos**, contado card a card contra as folhas
  do vault. Ficam de fora os quatro que não estão `concluido`: `portal-remuneracao-frota`
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
