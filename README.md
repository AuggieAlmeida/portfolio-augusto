# Portfolio Augusto

Portfolio pessoal desenvolvido em Angular com foco em fintech, fullstack development e análise de dados.

## sobre o projeto

Portfolio profissional de Augusto Almeida, fullstack developer especializado em desenvolvimento web, qualidade de software e entusiasta de dados. O projeto demonstra habilidades técnicas através de uma aplicação moderna com temas claro/escuro, suporte multi-idioma e design responsivo.

## tecnologias

- **Frontend**: Angular 19, TypeScript, Tailwind CSS
- **Internacionalização**: ngx-translate (PT/EN)
- **Qualidade**: ESLint, Prettier, Husky, commitlint
- **Testes**: Jasmine, Karma
- **DevOps**: Docker, Docker Compose, GitHub Actions
- **Monitoramento**: Sentry, Web Vitals
- **Segurança**: Snyk, npm audit

## pré-requisitos

- Node.js 20.x ou superior
- npm 10.x ou superior
- Docker e Docker Compose (opcional)

## instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd portfolio-augusto
```

2. Instale as dependências:
```bash
npm install
```

3. Configure os hooks do git:
```bash
npm run prepare
```

## desenvolvimento

### servidor local

```bash
npm start
```

Acesse `http://localhost:4200` no navegador. A aplicação recarrega automaticamente quando arquivos são modificados.

### comandos disponíveis

- `npm start` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run watch` - Build em modo watch
- `npm test` - Executa testes unitários
- `npm run test:ci` - Testes em ambiente CI
- `npm run test:coverage` - Gera relatório de cobertura
- `npm run lint` - Executa linting
- `npm run lint:fix` - Corrige problemas de linting
- `npm run format` - Formata código com Prettier

### docker

```bash
# Build da imagem
npm run docker:build

# Executar container
npm run docker:run

# Docker Compose
npm run docker:compose
```

### make

O projeto inclui um Makefile para facilitar operações comuns:

```bash
make help          # Lista todos os comandos
make start         # Inicia containers
make build         # Reconstrói containers
make logs          # Mostra logs
make clean         # Remove containers e volumes
```

## estrutura do projeto
