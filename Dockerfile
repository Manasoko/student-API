#Build stage
FROM node:24-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:24-alpine as production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/app.js"]