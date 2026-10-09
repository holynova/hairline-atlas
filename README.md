# Hairline Atlas · 线感物集

A growing collection of nine pointer-responsive line drawings: everyday objects, vehicles, and website structures. Each figure is a portable standalone HTML page built with the Hairline Create skill and its fixed drawing engine.

## Run locally

Open `dist/index.html`, or serve `dist/` with a static file server, for example:

```sh
python3 -m http.server 8080 --directory dist
```

## Edit and rebuild the figures

Figure sources live in `src/figures/`. The project includes the `hairline-create` skill under `.agents/skills/hairline-create`. Follow its concept, build, validation, and visual-check steps. Then rebuild every standalone page with:

```sh
node scripts/build-figures.mjs
```

Generated pages land in `dist/figures/`; the showcase page is `dist/index.html`.

## Attribution

The drawing method and creator skill are by Lucas Marques. See the [Hairline skill](https://hairline.lucasmarkes.com/skill) and [MIT-licensed source](https://github.com/lucasmarkes/hairline).
