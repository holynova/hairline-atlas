# Hairline Atlas · 线感物集

A collection of fifty pointer-responsive Hairline drawings: ten each across everyday objects, transport, digital systems, world masterpieces, and mechanical principles. Every entry is a standalone HTML figure, and the gallery groups them into five chapters.

## Run locally

Open `dist/index.html`, or serve `dist/` with a static file server:

```sh
python3 -m http.server 8080 --directory dist
```

## Edit and rebuild

The collection and gallery copy live in `src/catalog.json`. The original nine figures are in `src/figures/`; the expanded scenes use the five category templates in `src/templates/`. Each template keeps the Hairline drawing engine fixed and gives every scene its own geometry and pointer-driven movement.

Rebuild the fifty standalone pages and the gallery with:

```sh
node scripts/build-figures.mjs
```

The script writes `dist/figures/*.html`, `dist/index.html`, and `dist/styles.css`. Figure validation and visual review use the included `hairline-create` skill under `.agents/skills/hairline-create`.

## Attribution

The drawing method and creator skill are by Lucas Marques. See the [Hairline skill](https://hairline.lucasmarkes.com/skill) and [MIT-licensed source](https://github.com/lucasmarkes/hairline).
