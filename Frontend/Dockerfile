FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Cài đặt các dependencies
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]