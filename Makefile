.PHONY: help install dev build clean deploy prepare-deploy start test lint format

# Variables
NODE_BIN := node_modules/.bin
DEPLOY_DIR := deploy

# Couleurs pour l'affichage
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Affiche l'aide
	@echo "$(BLUE)╔═══════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║         Makefile - Projet Sage-femme                     ║$(NC)"
	@echo "$(BLUE)╚═══════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)Commandes disponibles :$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

install: ## Installe toutes les dépendances
	@echo "$(BLUE)📦 Installation des dépendances...$(NC)"
	npm install
	@echo "$(GREEN)✅ Installation terminée !$(NC)"

dev: ## Lance le serveur de développement (frontend + backend)
	@echo "$(BLUE)🚀 Démarrage du mode développement...$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:5173$(NC)"
	@echo "$(YELLOW)Backend: http://localhost:3001$(NC)"
	@echo "$(YELLOW)Admin: http://localhost:5173/admin$(NC)"
	@echo ""
	@echo "$(GREEN)Lancement en parallèle...$(NC)"
	@(trap 'kill 0' SIGINT; npm run dev & npm run server & wait)

dev-frontend: ## Lance uniquement le frontend
	@echo "$(BLUE)🎨 Démarrage du frontend...$(NC)"
	npm run dev

dev-backend: ## Lance uniquement le backend
	@echo "$(BLUE)⚙️  Démarrage du backend...$(NC)"
	npm run server

build: ## Build le frontend pour la production
	@echo "$(BLUE)🔨 Build du frontend...$(NC)"
	npm run build
	@echo "$(GREEN)✅ Build terminé ! Fichiers dans dist/$(NC)"

preview: build ## Preview du build de production
	@echo "$(BLUE)👀 Preview du build...$(NC)"
	npm run preview

clean: ## Nettoie les fichiers générés
	@echo "$(RED)🧹 Nettoyage...$(NC)"
	rm -rf dist/
	rm -rf $(DEPLOY_DIR)/
	rm -rf node_modules/.vite/
	rm -rf server/database.sqlite
	rm -rf server/uploads/*
	@echo "$(GREEN)✅ Nettoyage terminé !$(NC)"

clean-all: clean ## Nettoie tout (y compris node_modules)
	@echo "$(RED)🧹 Nettoyage complet...$(NC)"
	rm -rf node_modules/
	@echo "$(GREEN)✅ Nettoyage complet terminé !$(NC)"

prepare-deploy: build ## Prépare le dossier de déploiement
	@echo "$(BLUE)📦 Préparation du déploiement...$(NC)"
	@./prepare-deploy.sh
	@echo "$(GREEN)✅ Dossier deploy/ prêt !$(NC)"

deploy: prepare-deploy ## Prépare et affiche les instructions de déploiement
	@echo ""
	@echo "$(GREEN)╔═══════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)║  Déploiement prêt !                                      ║$(NC)"
	@echo "$(GREEN)╚═══════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)📤 Prochaines étapes :$(NC)"
	@echo "  1. Uploader le contenu de $(BLUE)deploy/$(NC) via FTP"
	@echo "  2. SSH: $(BLUE)npm install --production$(NC)"
	@echo "  3. SSH: Éditer $(BLUE).env$(NC) avec votre JWT_SECRET"
	@echo "  4. SSH: $(BLUE)pm2 start ecosystem.config.cjs$(NC)"
	@echo ""
	@echo "$(YELLOW)📚 Voir DEPLOIEMENT.md pour plus de détails$(NC)"
	@echo ""

start: ## Démarre le serveur en mode production
	@echo "$(BLUE)🚀 Démarrage en production...$(NC)"
	NODE_ENV=production npm start

lint: ## Vérifie le code avec ESLint
	@echo "$(BLUE)🔍 Vérification du code...$(NC)"
	npm run lint

format: ## Formate le code (si prettier est installé)
	@echo "$(BLUE)✨ Formatage du code...$(NC)"
	@if [ -f "$(NODE_BIN)/prettier" ]; then \
		$(NODE_BIN)/prettier --write "src/**/*.{js,jsx,css}"; \
	else \
		echo "$(YELLOW)⚠️  Prettier non installé$(NC)"; \
	fi

test: ## Lance les tests (si configurés)
	@echo "$(BLUE)🧪 Lancement des tests...$(NC)"
	@echo "$(YELLOW)⚠️  Aucun test configuré pour le moment$(NC)"

db-reset: ## Réinitialise la base de données (DEV ONLY)
	@echo "$(RED)⚠️  Réinitialisation de la base de données...$(NC)"
	@read -p "Êtes-vous sûr ? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		rm -f server/database.sqlite; \
		echo "$(GREEN)✅ Base de données supprimée$(NC)"; \
	else \
		echo "$(YELLOW)Annulé$(NC)"; \
	fi

db-backup: ## Sauvegarde la base de données
	@echo "$(BLUE)💾 Sauvegarde de la base de données...$(NC)"
	@if [ -f server/database.sqlite ]; then \
		cp server/database.sqlite server/database.sqlite.backup-$$(date +%Y%m%d-%H%M%S); \
		echo "$(GREEN)✅ Sauvegarde créée !$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  Aucune base de données à sauvegarder$(NC)"; \
	fi

uploads-clean: ## Nettoie le dossier uploads
	@echo "$(RED)🧹 Nettoyage du dossier uploads...$(NC)"
	@read -p "Supprimer toutes les images uploadées ? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		rm -rf server/uploads/*; \
		echo "$(GREEN)✅ Dossier uploads nettoyé$(NC)"; \
	else \
		echo "$(YELLOW)Annulé$(NC)"; \
	fi

logs: ## Affiche les logs PM2 (production)
	@echo "$(BLUE)📋 Logs de l'application...$(NC)"
	pm2 logs midwife-app

status: ## Affiche le statut PM2 (production)
	@echo "$(BLUE)📊 Statut de l'application...$(NC)"
	pm2 status

restart: ## Redémarre l'application PM2 (production)
	@echo "$(BLUE)🔄 Redémarrage de l'application...$(NC)"
	pm2 restart midwife-app

stop: ## Arrête l'application PM2 (production)
	@echo "$(RED)⏹️  Arrêt de l'application...$(NC)"
	pm2 stop midwife-app

info: ## Affiche les informations du projet
	@echo "$(BLUE)╔═══════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║  Informations du projet                                  ║$(NC)"
	@echo "$(BLUE)╚═══════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)Nom:$(NC)          Midwife - Site de sage-femme"
	@echo "$(YELLOW)Version:$(NC)      $$(node -p "require('./package.json').version")"
	@echo "$(YELLOW)Node:$(NC)         $$(node --version)"
	@echo "$(YELLOW)NPM:$(NC)          $$(npm --version)"
	@echo ""
	@echo "$(YELLOW)URLs de développement:$(NC)"
	@echo "  Frontend:   http://localhost:5173"
	@echo "  Backend:    http://localhost:3001"
	@echo "  Admin:      http://localhost:5173/admin"
	@echo ""

generate-secret: ## Génère un nouveau JWT_SECRET
	@echo "$(BLUE)🔐 Génération d'un JWT_SECRET...$(NC)"
	@echo ""
	@node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
	@echo ""
	@echo "$(YELLOW)Copiez cette valeur dans votre fichier .env$(NC)"

check-env: ## Vérifie la configuration .env
	@echo "$(BLUE)🔍 Vérification de la configuration...$(NC)"
	@if [ -f .env ]; then \
		echo "$(GREEN)✅ Fichier .env trouvé$(NC)"; \
		if grep -q "CHANGEZ_MOI" .env 2>/dev/null; then \
			echo "$(RED)⚠️  JWT_SECRET non configuré !$(NC)"; \
		else \
			echo "$(GREEN)✅ JWT_SECRET configuré$(NC)"; \
		fi \
	else \
		echo "$(YELLOW)⚠️  Fichier .env non trouvé$(NC)"; \
	fi

setup: install ## Installation initiale complète
	@echo "$(BLUE)🎉 Configuration initiale...$(NC)"
	@mkdir -p server/uploads
	@echo "$(GREEN)✅ Projet configuré !$(NC)"
	@echo ""
	@echo "$(YELLOW)Prochaines étapes :$(NC)"
	@echo "  1. $(BLUE)make dev$(NC) pour démarrer le développement"
	@echo "  2. Accéder à http://localhost:5173"
	@echo "  3. Admin: http://localhost:5173/admin"
	@echo ""
