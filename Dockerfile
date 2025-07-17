# Usa Node.js LTS
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copia solo package.json y package-lock.json
COPY package*.json ./

# Instala dependencias (compression, express-static-gzip, etc.)
RUN npm install

# Copia el resto del código
COPY . .

# Compila y purga/minifica tu CSS (Tailwind en modo producción)
RUN npm run tailwind:build

# Instala brotli y gzip CLI para pre-comprimir assets
RUN apk add --no-cache brotli gzip

# Pre-comprime todos los archivos estáticos .js y .css en public/
RUN find public -type f \( -iname '*.js' -o -iname '*.css' \) \
    | while IFS= read -r f; do \
        gzip -kf9 "$f"; \
        brotli -f -q 11 "$f"; \
      done

# Expone el puerto 8080 para Cloud Run
ENV PORT=8080
EXPOSE 8080

# Comando para arrancar Express
CMD ["npm", "start"]