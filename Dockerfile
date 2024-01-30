FROM node:20-alpine

RUN apk upgrade && apk add curl && rm -rf /var/cache/apk/*
WORKDIR /app
RUN chown node:node .
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build-assets

CMD ["npm", "run", "start"]
EXPOSE 3000
