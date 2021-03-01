
FROM node:12-alpine

# Install Puppeteer dependency - latest Chromium (85) package
RUN apk add --no-cache \
     chromium \
     nss \
     freetype \
     freetype-dev \
     harfbuzz \
     ca-certificates \
     ttf-freefont \
     nodejs \
     yarn

#Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

#Puppeteer v5.2.1 works with Chromium 85.
RUN yarn add puppeteer@5.2.1

#Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
   && mkdir -p /home/pptruser/Downloads /app \
   && chown -R pptruser:pptruser /home/pptruser \
   && chown -R pptruser:pptruser /app

# Add Tini - for more info: https://github.com/krallin/tini
ENV TINI_VERSION v0.19.0
RUN apk add --update tini
ENTRYPOINT ["/sbin/tini", "--"]

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node . .

USER node

RUN npm install && npm cache clean --force --loglevel=error
RUN npm run build

EXPOSE 4000
CMD ["node","build/index.js"]