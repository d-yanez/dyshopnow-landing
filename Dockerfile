# Usa Node.js LTS
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copia solo los package.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia todo el código
COPY . .

# Compila TailwindCSS
RUN npx tailwindcss -i ./public/css/styles.css -o ./public/css/output.css

# Expone el puerto 8080 para Cloud Run
ENV PORT=8080
EXPOSE 8080

# Comando para arrancar Express
CMD ["npm", "start"]
