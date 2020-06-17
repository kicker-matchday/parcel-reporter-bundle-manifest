# Parcel Bundle Manifest Reporter

Parcel plugin for generating an bundle manifest.

This is a Parcel 2 rewrite of https://github.com/mugi-uno/parcel-plugin-bundle-manifest

# Usage

## install

```
yarn add @kicker-matchday/parcel-reporter-bundle-manifest -D
```

## build

```
parcel build entry.js
```

## Output

Output a `parcel-manifest.json` file to the same directory as the bundle file.

- dist/entry.html
- dist/{hash}.js
- dist/{hash}.css
- dist/parcel-manifest.json

The Manifest will look like this : 

```json
{
  "index.html": "/dist/index.html",
  "index.js": "/dist/5f0796534fe2892712053b3a035f585b.js",
  "main.scss": "/dist/5f0796534fe2892712053b3a035f585b.css"
}
```

License
========

MIT
