FROM node:18-alpine

WORKDIR /app

COPY . .

EXPOSE 5000

CMD ["npx", "http-server", ".", "-p", "5000"]
