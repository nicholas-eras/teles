# --- MUDANÇA AQUI: De node:18-alpine para node:20-alpine ---
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia código fonte
COPY . .

# Gera o cliente do Prisma
RUN npx prisma generate

# Compila o projeto
RUN npm run build

# Expõe a porta
EXPOSE 3000

# Inicia
CMD ["npm", "run", "start:dev"]