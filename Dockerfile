FROM node:16-alpine AS builder
WORKDIR /usr/src/frontend
COPY ./frontend/package*json ./
RUN npm install
COPY ./frontend/ ./
RUN npm run build

FROM node:16-alpine
WORKDIR /usr/src/server
COPY --from=builder /usr/src/frontend/dist/ /usr/src/server/public/
COPY ./backend/package*json .
RUN npm install
COPY ./backend/ .
EXPOSE 3000
CMD [ "npm", "run", "start"]
