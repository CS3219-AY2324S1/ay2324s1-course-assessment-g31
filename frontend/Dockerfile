FROM node:20-alpine as BUILD_IMAGE  

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "dev"]