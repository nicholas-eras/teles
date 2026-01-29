# --- ALTERAÇÃO AQUI: Mudamos de 18 para 20 ---
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar em desenvolvimento
CMD ["npm", "run", "dev"]