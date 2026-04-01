# =============================================================
# Multi-stage build — pourquoi c'est pertinent :
# - Sécurité : l'image finale ne contient pas les devDependencies
#   (Jest, Supertest) ni les outils de build. Surface d'attaque réduite.
# - Taille : node:20-alpine (~170 MB) vs node:20 (~1 GB).
#   L'image de production ne contient que le strict nécessaire.
# =============================================================

# ── STAGE 1 : test ─────────────────────────────────────────
# Image complète pour installer toutes les dépendances (dev incluses)
# et exécuter les tests unitaires.
# Si les tests échouent, le build s'arrête ici → protection qualité.
FROM node:20-alpine AS tester

WORKDIR /app

COPY package*.json ./
# npm ci installe TOUTES les dépendances (dev + prod) pour les tests
RUN npm ci

COPY . .

# Exécution des tests — le build échoue si un test ne passe pas
RUN npm test

# ── STAGE 2 : production ────────────────────────────────────
# Image légère : on repart de zéro et on ne copie que les node_modules
# de production (sans Jest, Supertest, etc.)
FROM node:20-alpine AS production

# Utilisateur non-root pour la sécurité (principe du moindre privilège)
RUN addgroup -S vitalsync && adduser -S vitalsync -G vitalsync

WORKDIR /app

COPY package*.json ./
# --only=production : exclut les devDependencies de l'image finale
RUN npm ci --omit=dev

COPY server.js .

RUN chown -R vitalsync:vitalsync /app
USER vitalsync

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
