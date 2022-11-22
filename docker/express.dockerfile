FROM node:18.12.1 AS builder
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json ./
COPY src src
RUN npm run build

FROM node:18.12.1
ENV NODE_ENV production
COPY package*.json ./
RUN npm install
COPY --from=builder /dist /dist
EXPOSE 8000
CMD ["npm", "start"]