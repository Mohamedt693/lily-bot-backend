# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"
WORKDIR /app
ENV NODE_ENV="production"

# --- مرحلة البناء ---
FROM base AS build
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential python-is-python3
COPY package-lock.json package.json ./
RUN npm ci

# --- المرحلة النهائية (نظيفة وخفيفة) ---
FROM base
# نسخ مجلد الـ node_modules فقط من مرحلة البناء
COPY --from=build /app/node_modules /app/node_modules
# نسخ الكود المصدري فقط
COPY . .

# تأكد من أن المنفذ يتطابق مع fly.toml (غالباً 8080)
EXPOSE 8080
CMD [ "npm", "run", "start" ]