# Parisa Barani / Studio Baran — website

A restrained, editorial portfolio site separating four parts of one
practice: **Work** (professional interior projects completed with
other studios), **Studio Baran** (independent practice), **Exhibitions**,
and **Art**.

## Opening it

This is a plain HTML/CSS/JS build — no install, no build step. Unzip
the folder and double-click `index.html` to open it in a browser. If
your browser blocks local `fetch`-like behaviour for file:// pages,
just serve the folder instead (optional):

```
cd parisa-barani
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Why this instead of Next.js

The brief asked for Next.js/React/TypeScript/Tailwind, which is the
right long-term choice once this is a production site with real
image optimisation, a CMS, etc. But that stack needs a server and a
build step to view, which isn't practical as a first look. This build
uses the same structure a Next.js migration would use — one data file,
one component per content type — so moving it into Next.js later is
mostly copy-and-adjust, not a rewrite. Ask if you'd like that
migration done.

## Editing content

Everything — every project, exhibition and artwork — lives in
`js/data.js`. Open that file, copy an existing entry, change the
fields, save. No other file needs to change. Each field is commented.

## Adding images

Drop image files into `images/work/`, `images/studio-baran/`,
`images/exhibitions/` or `images/art/` using the exact filenames
already referenced in `js/data.js`. Until a file exists at a given
path, that spot renders as an abstract material-study composition
instead of a broken image. These temporary visuals are deterministic
per project and are replaced automatically when photography is added.

## Structure

```
index.html                  Home
work.html                   Professional work — index
work-detail.html            Professional work — case study (?slug=)
studio-baran.html           Studio Baran — index
studio-baran-detail.html    Studio Baran — project (?slug=)
exhibitions.html            Exhibitions — chronological list
exhibitions-detail.html     Exhibition — immersive page (?slug=)
art.html                    Art — gallery index
art-detail.html             Art — single piece (?slug=)
about.html                  About
contact.html                Contact
css/style.css               Design system (tokens, type, layout)
js/data.js                  ALL content — edit this to update the site
js/main.js                  Shared rendering (nav, footer, grids, lists)
```

## Placeholder content

Every project, exhibition and artwork currently in `js/data.js` is
placeholder content written to test the layout — not real history.
Bracketed fields like `[Studio Name]` and `[Gallery / Institution
Name]` are meant to be replaced directly; nothing here should be
mistaken for a real credit, client or press mention.
