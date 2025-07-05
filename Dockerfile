# Build stage: compila Tailwind
FROM node:20 AS builder

WORKDIR /app

# Copia dependencias e instala
COPY package*.json ./
RUN npm install

# Copia código y compila TailwindCSS
COPY . .
RUN npx tailwindcss -i ./public/css/styles.css -o ./public/css/output.css

# Runtime stage: Nginx para servir contenido estático
FROM nginx:alpine

# Copia archivos estáticos al directorio público de Nginx
COPY --from=builder /app/public /usr/share/nginx/html

# Copia configuración básica de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
