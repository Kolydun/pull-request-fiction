# Your Energy

Multi-page **Vite + Vanilla JS + CSS** app for the GoIT "Your Energy" team project.
Find exercises by category, search, rate them, save favorites and stay motivated.

## Tech stack

Vite · Vanilla JS (ES modules) · CSS · modern-normalize · axios ·
ESLint + Prettier + EditorConfig · GitHub Pages.

## Scripts

```bash
npm install     # install dependencies
npm run dev     # start the dev server
npm run build   # production build to dist/
npm run preview # preview the production build
npm run lint    # lint the codebase
```

## Project structure

```
src/
  index.html / favorites.html  # pages; each dev adds their own <load>
  partials/                    # empty; each dev creates their own HTML file
  main.js / favorites.js       # per-page scripts
  css/
    main.css                   # shared styles; each dev adds an @import
    common/                    # variables, base, loader
  js/
    api/energyApi.js           # API service (lead-owned)
    constants/                 # shared constants (lead-owned)
    helpers/                   # loader
  images/                      # static images
  public/                      # favicon
```

Each feature ticket creates its own partial, JS and CSS. Static markup goes in the partial. Repeated cards from the API are built in JS.
Shared/lead-owned files are listed in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

- **[DEVELOPERS.md](./DEVELOPERS.md)** — how to build your component step by step (start here).
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — branch model, naming, commit and PR rules.

Branch from `dev`, open PRs into `dev`; `main` stays protected and deployable.

## Deploy

Pushing to `main` builds and publishes `dist/` to the `gh-pages` branch via GitHub Actions.
The site is served under the `/pull-request-fiction/` subpath.
