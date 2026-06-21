FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.ts"]
