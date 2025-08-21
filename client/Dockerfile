FROM node:22-alpine

WORKDIR /app

# Install curl and bash
RUN apk add --no-cache curl bash \
  && curl -fsSL https://bun.sh/install | bash \
  && ln -s /root/.bun/bin/bun /usr/local/bin/bun

COPY . .

RUN bun install && bun run build

EXPOSE 3000
CMD ["bun", "start"]
