FROM node:23-alpine3.20

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]