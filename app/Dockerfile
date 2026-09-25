FROM node:20-alpine

WORKDIR /opt/app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV PORT=1337

EXPOSE 1337

CMD ["npm", "run", "start"]