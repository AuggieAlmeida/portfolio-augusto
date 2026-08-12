# Portfolio Augusto

Portfólio pessoal de **Augusto de Barros Almeida** — desenvolvedor fullstack com foco em qualidade de software, automação e dados.

No ar em [auggiealmeida.vercel.app](https://auggiealmeida.vercel.app/).

## sobre o projeto

Single-page em Angular: hero, sobre, trajetória, projetos, skills e rodapé, com tema claro/escuro e dois idiomas. O conteúdo de projetos, skills e trajetória vem de JSONs locais em `src/app/components/*/`; os textos vêm de `src/assets/i18n/`.

Esta é a **v1** da suíte de portfólios. As versões seguintes (api + portfolio-v2 + portfolio-os) vivem no monorepo `Augusto-portfolio/`, um nível acima. A v1 segue sendo o site publicado até a v2 substituí-la.

## tecnologias

- **Frontend**: Angular 19 (standalone, sem router), TypeScript strict, Tailwind CSS
- **Internacionalização**: ngx-translate (pt/en), com escolha persistida em `localStorage`
- **Qualidade**: ESLint, Prettier, Husky, lint-staged, commitlint
- **Testes**: Jasmine + Karma
- **Observabilidade**: Sentry (opcional, ligado por DSN) e Core Web Vitals
- **DevOps**: Docker, Docker Compose, GitHub Actions, Vercel

## pré-requisitos

- Node.js 20.x ou superior
- npm 10.x ou superior
- Docker e Docker Compose (opcional)

## instalação

```bash
npm install
```

O `npm install` já roda `husky` e instala os hooks de commit.

## desenvolvimento

```bash
npm start
```

Acesse `http://localhost:4200`.

### comandos disponíveis

| Comando                           | O que faz                                         |
| --------------------------------- | ------------------------------------------------- |
| `npm start`                       | Servidor de desenvolvimento                       |
| `npm run build`                   | Build de produção                                 |
| `npm run watch`                   | Build em modo watch                               |
| `npm test`                        | Testes unitários (watch)                          |
| `npm run test:ci`                 | Testes headless, uma passada                      |
| `npm run test:coverage`           | Relatório de cobertura                            |
| `npm run lint` / `lint:fix`       | Linting                                           |
| `npm run format` / `format:check` | Prettier                                          |
| `npm run i18n:check`              | Valida paridade de chaves entre locales           |
| `npm run analyze`                 | Inspeciona o tamanho dos bundles                  |
| `npm run security:audit`          | Audita dependências de runtime, falha em critical |
| `npm run security:audit:full`     | Auditoria completa, incluindo build e dev         |

### docker

```bash
npm run docker:dev
```

```bash
npm run docker:prod
```

`docker:dev` sobe o `ng serve` em container na porta 4200; `docker:prod` sobe o build estático servido por nginx na porta 80. Para derrubar: `npm run docker:stop:dev` e `npm run docker:stop:prod`.

### make

`make help` lista todos os alvos, gerados a partir dos próprios comentários do Makefile. Os principais:

```bash
make dev           # servidor de desenvolvimento
make quality       # lint + format + i18n + testes
make docker-prod   # build estático em nginx
```

## configuração

`src/environments/environment.ts` (dev) e `environment.prod.ts` (produção, aplicado via `fileReplacements` no build de produção):

| Campo        | Efeito                                                                         |
| ------------ | ------------------------------------------------------------------------------ |
| `production` | Diferencia os dois ambientes                                                   |
| `logLevel`   | Piso do `LoggingService`: `debug` \| `info` \| `warn` \| `error`               |
| `sentryDsn`  | Vazio desliga o Sentry. Preencher liga init + captura de exceções não tratadas |

O DSN do Sentry é público por design e pode ser commitado. Nenhum outro segredo vive neste repositório.

## internacionalização

Locales em `src/assets/i18n/{pt,en}.json`. `pt` é o fallback.

Chave faltando não quebra o build: o ngx-translate renderiza a string da chave crua na tela. Por isso `npm run i18n:check` roda no CI e falha quando um locale diverge do outro ou quando o código referencia uma chave que nenhum locale define.

Ao adicionar texto novo, adicione a chave nos **dois** arquivos.

## estrutura do projeto

```
src/
├── app/
│   ├── components/           uma pasta por seção (template inline)
│   │   ├── about/ carrer/ footer/ header/ hero/ projects/ skills/
│   │   └── */*.json          dados de projetos, skills e trajetória
│   ├── core/
│   │   ├── error-handling/   ErrorHandler global (loga + envia ao Sentry)
│   │   ├── i18n/             LocaleService + locales suportados
│   │   ├── logging/          LoggingService com piso por ambiente
│   │   ├── monitoring/       coleta de Core Web Vitals
│   │   └── services/         NavService (scrollspy), ThemeService
│   ├── app.component.*       composição das seções
│   └── app.config.ts         providers da aplicação
├── assets/i18n/              pt.json, en.json
├── environments/             environment.ts, environment.prod.ts
└── index.html                metadados, fontes, Font Awesome

tools/check-i18n.mjs          validador de locales usado pelo CI
vercel.json                   headers de segurança, cache e rewrite SPA
```

## deploy

Publica a **integração Git da Vercel**, que constrói a partir de `main` sozinha. `vercel.json` define o diretório de saída (`dist/portfolio-augusto/browser`), o rewrite de SPA e os headers de segurança — CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy`.

`.github/workflows/main.yml` é **gate de qualidade, não deploy**: lint, formatação, i18n, testes, build e auditoria. Para que ele realmente proteja a publicação, o check `Lint, test and build` precisa ser exigido em branch protection na `main` — sem isso a Vercel publica mesmo com o CI vermelho.

`security-scan.yml` escaneia a imagem Docker com Trivy semanalmente, em modo relatório. A imagem não é o artefato de produção; ela cobre o caminho alternativo de self-host com nginx.

## dívida conhecida

**Angular 19 → 22 adiado.** O `npm audit` completo aponta 20 advisories `high` e 1 `critical`. Todas têm a mesma correção: subir a linha do Angular, o que é semver-major. A maioria vive em dependências de build (`@angular/cli`, `@angular-devkit/build-angular`, `vite`, `tar`, `postcss`) e nunca chega ao navegador de ninguém.

Duas alcançam runtime e merecem registro: sanitização em two-way binding no `@angular/compiler` e o advisory de hydration no `@angular/core` — este último não se aplica aqui, porque a aplicação não usa SSR nem hydration.

Por isso o gate bloqueante do CI é `npm audit --omit=dev --audit-level=critical`, e a auditoria completa roda como aviso. A decisão é deliberada: esta versão está em modo de estabilização até a v2 substituí-la, e um upgrade major de framework contradiz esse modo. Se a v1 sobreviver mais do que o previsto, o upgrade volta à mesa.
