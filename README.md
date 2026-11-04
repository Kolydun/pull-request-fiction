# Your Energy

Multi-page **Vite + Vanilla JS + SCSS** app for the GoIT "Your Energy" team project.
Find exercises by category, search, rate them, save favorites and stay motivated.

## Tech stack

Vite · Vanilla JS (ES modules) · SCSS (Dart Sass) · modern-normalize · axios · iziToast ·
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
index.html / favorites.html   # two page entries (multi-page Vite)
src/
  main.js / favorites.js       # per-page bootstrap: call each init*()
  sass/
    main.scss                  # global entry + component @use list (lead-owned)
    common/                    # variables, mixins, base, fonts
  js/
    api/energyApi.js           # API service (lead-owned)
    constants/                 # shared constants (lead-owned)
    helpers/                   # storage, notify, pagination, loader
    components/<name>/          # one folder per ticket: <name>.js + <name>.scss
  images/                      # static images
public/                        # favicon, manifest, robots.txt
```

Each feature ticket owns exactly one `src/js/components/<name>/` folder and its SCSS partial.
Shared/lead-owned files are listed in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

Branch model, naming, commit and PR rules are in [CONTRIBUTING.md](./CONTRIBUTING.md).
Branch from `dev`, open PRs into `dev`; `main` stays protected and deployable.

## Deploy

Pushing to `main` builds and publishes `dist/` to the `gh-pages` branch via GitHub Actions.
The site is served under the `/pull-request-fiction/` subpath.
