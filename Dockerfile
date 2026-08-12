# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Development stage
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD ["npm", "start"]

# Production stage
# Pinado por tag e digest: `nginx:alpine` é um alias móvel, então o Trivy media
# uma base diferente a cada semana e nenhum resultado era reproduzível. O PR do
# Snyk de 2026-02-07 propunha `1.29.5-alpine3.23`, que já está seis meses atrás;
# entra o stable atual. Trocar exige atualizar tag e digest juntos.
FROM nginx:1.31.3-alpine3.24@sha256:4a73073bd557c65b759505da037898b61f1be6cbcc3c2c3aeac22d2a470c1752 AS production
COPY --from=build /app/dist/portfolio-augusto/browser /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]