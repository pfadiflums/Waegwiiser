# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Den Rest des Codes kopieren und bauen
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve
# Wir nehmen ein extrem leichtes Node-Image zum Ausliefern
FROM node:22-alpine
WORKDIR /app

# Installiere den statischen Webserver 'serve'
RUN npm install -g serve

# Kopiere nur die gebauten Dateien aus Stage 1
# WICHTIG: Prüfe, ob dein Ordner 'waegwiiser/browser' oder nur 'waegwiiser' heißt
COPY --from=build /app/dist/waegwiiser/browser ./dist

# Port freigeben
EXPOSE 3000

# Startbefehl
CMD ["serve", "-s", "dist", "-l", "3000"]
