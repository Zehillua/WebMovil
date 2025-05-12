FROM node:22

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY . .
RUN rm -rf .env
RUN npm cache clean --force
RUN npm install -g npm@latest
RUN npm install --legacy-peer-deps

# 🔧 Compila el código TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
