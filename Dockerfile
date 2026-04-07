FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

RUN npx prisma migrate dev --name init

ENV PORT=5000

EXPOSE ${PORT}

CMD ["sh", "-c", "PORT=$PORT npm run start:prod"]