# aroh.si

Holding page for Aroh. A single static page in `public/index.html`, served by Cloudflare Workers static assets.

## Preview locally

```sh
npx wrangler dev
```

## Deploy

```sh
npx wrangler deploy
```

This publishes `public/` and serves it on `aroh.si` and `www.aroh.si` (see `wrangler.jsonc`).
