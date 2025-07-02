FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json si existe
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Instalar netcat para verificar conexión
RUN apk add --no-cache netcat-openbsd

# Comando para esperar a MongoDB y ejecutar seed
CMD ["sh", "-c", "while ! nc -z mongo 27017; do sleep 1; done && node seed.js"]
