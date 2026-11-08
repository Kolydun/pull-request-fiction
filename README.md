# Your Energy

A fitness web app built by a team of ten as the GoIT Advanced JavaScript team project.
Pick exercises by muscle group, body part or equipment, search them, open the details,
rate them and keep your favorites in one place.

**Live site:** https://kolydun.github.io/pull-request-fiction/

![Your Energy home page](./docs/preview.jpg)

## Features

- **Home page.** Hero with popular tags, the quote of the day and a reminder to train
  110 minutes a day.
- **Filters and categories.** Muscles, Body parts and Equipment, with categories loaded
  from the API. Muscles is selected by default.
- **Exercises.** The exercise list for the selected category, keyword search and
  server-side pagination.
- **Exercise modal.** Animated demo (when available), rating, target, body part, popularity,
  calories and description, plus a button to add or remove the exercise from favorites.
- **Rating.** A form with a star rating, an email and a comment. Errors from the server
  are shown as a notification.
- **Favorites page.** Exercises saved in `localStorage`, with removal and pagination.
- **Quote of the day.** Requested once a day and cached in `localStorage`.
- **Header and footer.** Burger menu on mobile, GoIT social links and a newsletter
  subscription form with email validation.
- **Loader and Scroll up button.** Shown on every async request and on long pages.
- **Responsive layout.** Mobile (320px), tablet (768px) and desktop (1440px).

## Tech stack

Vite · Vanilla JS (ES modules) · CSS · modern-normalize · axios ·
ESLint · Prettier · EditorConfig · GitHub Actions · GitHub Pages.

The data comes from the [Your Energy API](https://your-energy.b.goit.study/api-docs).

## Getting started

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
  index.html, favorites.html  # pages that assemble the partials with <load>
  main.js, favorites.js       # entry points: init the blocks on each page
  partials/                   # HTML of each block (header, hero, categories, ...)
  css/
    main.css                  # imports every block's styles
    common/                   # variables, base styles, loader
  js/
    api/energyApi.js          # API requests
    constants/                # API URL, endpoints, filter types
    helpers/                  # loader
    exercises/                # exercise list and exercise card
    *.js                      # one module per block (categories, modal, storage, ...)
  images/                     # optimized images, including @2x for Retina
    icons/icons.svg           # SVG sprite
  public/                     # favicon
```

Each block has its own partial, CSS file and JS module. Blocks talk to each other
through `CustomEvent`s on `document` (`category:selected`, `filter:changed`,
`favorites:changed`, `rating:open`). These contracts were agreed in the issues
before development started.

## Team

| Member                                                      | Task                                                                                          |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Kolydun](https://github.com/Kolydun)                       | Team lead: repository, project structure, exercise list and search, code review, final polish |
| [lytvynko](https://github.com/lytvynko)                     | Header, burger menu, social links                                                             |
| [hidanrdn-edu](https://github.com/hidanrdn-edu)             | Hero and Scroll up button                                                                     |
| [NM94](https://github.com/NM94)                             | Footer and subscription form                                                                  |
| [nataliasudnyk-lgtm](https://github.com/nataliasudnyk-lgtm) | Quote of the day and the 110 min block                                                        |
| [OlenaShatalova](https://github.com/OlenaShatalova)         | Filters and categories                                                                        |
| [MarynaShavlak](https://github.com/MarynaShavlak)           | Pagination                                                                                    |
| [GrigoriFil](https://github.com/GrigoriFil)                 | Exercise modal and favorites storage                                                          |
| [Smartfoxy](https://github.com/Smartfoxy)                   | Favorites page                                                                                |
| [AnnaOvcharova](https://github.com/AnnaOvcharova)           | Rating modal                                                                                  |

## Workflow

Every task had its own issue, branch (`feat/<id>-<name>`) and pull request. Feature
branches were merged into `dev`, and `dev` was merged into `main`. The rules are in [CONTRIBUTING.md](./CONTRIBUTING.md), and the
step-by-step guide for building a block is in [DEVELOPERS.md](./DEVELOPERS.md).

## Deploy

Every push to `main` builds the project and publishes `dist/` to the `gh-pages` branch
with GitHub Actions. The site is served under the `/pull-request-fiction/` subpath.
