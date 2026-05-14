# kurikomi-site

Source for [kurikomi.com](https://kurikomi.com).

Astro, vanilla CSS, no JavaScript at runtime. Deployed on Cloudflare Pages.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to ./dist
npm run preview
```

## Regenerate assets

```sh
node scripts/build-og.mjs          # public/og.png
node scripts/build-apple-icon.mjs  # public/apple-touch-icon.png
```

## Deploy

Cloudflare Pages builds from `main`. Build command: `npm run build`. Output directory: `dist`.

## License

Source under MIT. Brand assets and copy © Kurikomi, Inc.
