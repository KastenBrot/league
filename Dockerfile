FROM node:22-alpine AS deps
WORKDIR /app

# better-sqlite3 needs a toolchain during install
RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "build"]
