# Variáveis
NPM ?= npm
DOCKER_COMPOSE = docker compose
FRONTEND_CONTAINER = portfolio

# Cores para output
GREEN = \033[0;32m
NC = \033[0m
RED = \033[0;31m
YELLOW = \033[1;33m

.DEFAULT_GOAL := help

.PHONY: help start build watch test test-ci test-coverage lint lint-fix format \
        docker-build docker-run compose compose-build audit analyze compress \
        prepare backup backup-scheduled tailwind-build tailwind-watch

help:
	@cat makefile.txt

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
test: ## Executa testes unitários
	@echo "$(GREEN)Executando testes...$(NC)"
	$(NPM) test

test-ci: ## Testes em CI (headless)
	@echo "$(GREEN)Executando testes em CI...$(NC)"
	$(NPM) run test:ci

test-coverage: ## Gera relatório de cobertura
	@echo "$(GREEN)Gerando relatório de cobertura...$(NC)"
	$(NPM) run test:coverage

lint: ## Executa linting
	@echo "$(GREEN)Executando linting...$(NC)"
	$(NPM) run lint

lint-fix: ## Corrige problemas de linting
	@echo "$(GREEN)Corrigindo problemas de linting...$(NC)"
	$(NPM) run lint:fix

format: ## Formata código com Prettier
	@echo "$(GREEN)Formatando código...$(NC)"
	$(NPM) run format

# Docker
docker-build: ## Build da imagem Docker
	@echo "$(GREEN)Construindo imagem Docker...$(NC)"
	$(NPM) run docker:build

docker-run: ## Executa container Docker
	@echo "$(GREEN)Executando container Docker...$(NC)"
	$(NPM) run docker:run

compose: ## Sobe via Docker Compose
	@echo "$(GREEN)Iniciando Docker Compose...$(NC)"
	$(NPM) run docker:compose

compose-build: ## Sobe via Docker Compose (build)
	@echo "$(GREEN)Iniciando Docker Compose com build...$(NC)"
	$(NPM) run docker:compose:build

# Segurança e análise
audit: ## Auditoria de vulnerabilidades
	@echo "$(GREEN)Executando auditoria de segurança...$(NC)"
	$(NPM) run security:audit

analyze: ## Analisa bundles
	@echo "$(GREEN)Analisando bundles...$(NC)"
	$(NPM) run analyze

compress: ## Gera arquivos gzip
	@echo "$(GREEN)Gerando arquivos gzip...$(NC)"
	$(NPM) run compress

# Outros
prepare: ## Instala hooks do Husky
	@echo "$(GREEN)Instalando hooks do Husky...$(NC)"
	$(NPM) run prepare

backup: ## Executa script de backup
	@echo "$(GREEN)Executando backup...$(NC)"
	$(NPM) run backup

backup-scheduled: ## Executa backup agendado
	@echo "$(GREEN)Executando backup agendado...$(NC)"
	$(NPM) run backup:scheduled

# Tailwind
tailwind-build: ## Gera CSS minificado do Tailwind
	@echo "$(GREEN)Gerando CSS do Tailwind...$(NC)"
	$(NPM) run tailwind:build

tailwind-watch: ## Observa alterações do Tailwind
	@echo "$(GREEN)Observando alterações do Tailwind...$(NC)"
	$(NPM) run tailwind:watch

# Comandos compostos
dev: start ## Ambiente de desenvolvimento completo
	@echo "$(GREEN)Ambiente de desenvolvimento iniciado$(NC)"
	@echo "Acesse: http://localhost:4200"

quality: lint format test ## Executa verificação de qualidade completa
	@echo "$(GREEN)Verificação de qualidade concluída$(NC)"

docker: docker-build docker-run ## Build e execução Docker completa
	@echo "$(GREEN)Container Docker executando$(NC)"
