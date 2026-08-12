# Variáveis
NPM ?= npm

# Cores para output
GREEN = \033[0;32m
NC = \033[0m

.DEFAULT_GOAL := help

.PHONY: help start build watch test test-ci test-coverage lint lint-fix format \
        i18n-check docker-dev docker-prod docker-stop-dev docker-stop-prod \
        docker-logs-dev docker-logs-prod audit analyze prepare dev quality

help: ## Lista os comandos disponíveis
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-18s$(NC) %s\n", $$1, $$2}'

# Desenvolvimento
start: ## Inicia servidor de desenvolvimento
	@echo "$(GREEN)Iniciando servidor de desenvolvimento...$(NC)"
	$(NPM) start

build: ## Gera build de produção
	@echo "$(GREEN)Gerando build de produção...$(NC)"
	$(NPM) run build

watch: ## Build em modo watch
	@echo "$(GREEN)Build em modo watch...$(NC)"
	$(NPM) run watch

# Testes e qualidade
test: ## Executa testes unitários (watch)
	$(NPM) test

test-ci: ## Testes em CI (headless)
	$(NPM) run test:ci

test-coverage: ## Gera relatório de cobertura
	$(NPM) run test:coverage

lint: ## Executa linting
	$(NPM) run lint

lint-fix: ## Corrige problemas de linting
	$(NPM) run lint:fix

format: ## Formata código com Prettier
	$(NPM) run format

i18n-check: ## Valida paridade de chaves entre os locales
	$(NPM) run i18n:check

# Docker
docker-dev: ## Sobe o ambiente de desenvolvimento em container
	$(NPM) run docker:dev

docker-prod: ## Sobe o ambiente de produção em container (nginx)
	$(NPM) run docker:prod

docker-stop-dev: ## Derruba o ambiente de desenvolvimento
	$(NPM) run docker:stop:dev

docker-stop-prod: ## Derruba o ambiente de produção
	$(NPM) run docker:stop:prod

docker-logs-dev: ## Logs do ambiente de desenvolvimento
	$(NPM) run docker:logs:dev

docker-logs-prod: ## Logs do ambiente de produção
	$(NPM) run docker:logs:prod

# Segurança e análise
audit: ## Auditoria das dependências de runtime (falha em critical)
	$(NPM) run security:audit

analyze: ## Analisa o tamanho dos bundles
	$(NPM) run analyze

# Outros
prepare: ## Instala hooks do Husky
	$(NPM) run prepare

dev: start ## Ambiente de desenvolvimento completo

quality: lint format i18n-check test-ci ## Verificação de qualidade completa
	@echo "$(GREEN)Verificação de qualidade concluída$(NC)"
