# Utiliza una imagen oficial de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios
COPY package.json ./
COPY package-lock.json ./
COPY . .
RUN rm -rf .env
RUN npm cache clean --force

RUN npm install -g npm@latest
# Instala las dependencias
RUN npm install --legacy-peer-deps

# Expone el puerto
EXPOSE 3004

# Comando para iniciar el servidor
CMD ["npm", "run", "start"]