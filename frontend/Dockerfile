FROM node:20-alpine

WORKDIR /app

# Cache para evitar reinstalacao de dependencias quando algum arquivo de codigo é alterado
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0"]
