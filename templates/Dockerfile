FROM node:24-trixie-slim AS build_app
WORKDIR /usr/src/app/

COPY package*.json /usr/src/app/
RUN --mount=type=cache,target=/root/.npm \
  npm ci --no-audit

COPY . /usr/src/app
RUN npm run build && \
    find src -name "*.gql" -exec cp --parents {} .dist/ \;

FROM node:24-trixie-slim
WORKDIR /app
ENTRYPOINT ["tini", "--"]
CMD ["node", "src/index.js"]

RUN apt update \
  && apt install -y --no-install-recommends tini \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json /app/
RUN --mount=type=cache,target=/root/.npm \
  npm ci --no-audit --omit=dev

COPY --from=build_app /usr/src/app/.dist /app

RUN chown -R node:node /app
USER node
