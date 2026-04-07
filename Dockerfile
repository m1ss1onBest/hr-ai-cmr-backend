FROM node:20

ENV PORT=5000

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE ${PORT}

CMD ["sh", "-c", "npx prisma migrate deploy && PORT=$PORT npm run start:prod"]
