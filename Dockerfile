# Usa Node.js LTS
FROM node:20

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia todo el código
COPY . .

# Compila TailwindCSS
RUN npx tailwindcss -i ./public/css/styles.css -o ./public/css/output.css

# Expone el puerto (Cloud Run usa 8080)
ENV PORT=8080
EXPOSE 8080

# Comando para iniciar
CMD ["npm", "start"]
