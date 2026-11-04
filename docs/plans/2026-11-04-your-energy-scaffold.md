# Your Energy — Team Scaffold Implementation Plan

> **For executors:** Implement task-by-task. Each task ends with a verification step and a commit. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare a Vite + Vanilla JS + SCSS repository scaffold for the GoIT "Your Energy" team project so that 10 developers can pick up ~10 independent tickets with minimal Git conflicts.

**Architecture:** Multi-page Vite app (`index.html` = Home, `favorites.html` = Favorites). All shared code (API, constants, helpers, global SCSS, HTML skeletons) is stabilized first by the team lead. Each feature ticket owns one isolated `components/<name>/` folder with co-located JS + SCSS partial. Entry points only call each component's `init()`.

**Tech Stack:** Vite, Vanilla JS (ES modules), SCSS (Dart Sass), modern-normalize, axios (API), izitoast (notify), ESLint + Prettier + EditorConfig, gh-pages deploy.

**Spec:** GoIT "Your Energy" technical task (filters/categories/exercises/modal/favorites/footer + API endpoints at `https://your-energy.b.goit.study/api`).

## Global Constraints

- No uppercase letters or spaces in file names; English alphabet only.
- Variables camelCase, classes PascalCase, constants UPPER_SNAKE_CASE.
- `modern-normalize` connected; fonts connected; favicons present.
- Static images live in `src/images/`, optimized incl. retina.
- Dev console must have no errors and no `console.log`.
- Three breakpoints: mobile / tablet / desktop.
- Final build deploys to GitHub Pages; only `main` and `gh-pages` survive at the end.

## Review Focus

- **gh-pages base path:** assets must load under `/pull-request-fiction/` subpath, not `/` (build must set `base`).
- **localStorage quote cache:** quote fetched once per day; a stale/next-day entry must trigger a refetch, not a crash on malformed JSON.
- **Empty API results:** filters/categories/exercises with zero results must render a user message, not a blank block.
- **Email validation:** footer + rating forms must reject invalid email via the spec's `pattern` before any request fires.
- **Modal lifecycle:** opening the rating modal over the exercise modal, then closing rating, must restore the exercise modal (not leave the page without a modal, and backdrop/ESC/button all close).

---

## Task 1: Initialize Vite project + build tooling

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.js`
- Modify: `README.md`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `preview`, `lint`; `vite.config.js` with multi-page `rollupOptions.input` (`index.html`, `favorites.html`) and `base: '/pull-request-fiction/'`.

- [ ] **Step 1:** Scaffold a Vanilla JS Vite project in-place; install `vite`, `sass`, `modern-normalize`, `axios`, `izitoast`.
- [ ] **Step 2:** Write `vite.config.js` with `base` and multi-page input (both HTML entries; `favorites.html` created in Task 6, so reference is allowed to not exist yet only until then).
- [ ] **Step 3:** Add scripts to `package.json` (`dev`, `build`, `preview`).
- [ ] **Step 4 (verify):** Run `npm run dev` → server starts with no errors. Run `npm run build` → `dist/` produced.
- [ ] **Step 5 (commit):** `chore: initialize vite project`

## Task 2: Linting, formatting, gitignore

**Files:**
- Create: `eslint.config.js`, `.prettierrc`, `.editorconfig`, `.gitignore`

**Interfaces:**
- Produces: `npm run lint` script.

- [ ] **Step 1:** Add ESLint (flat config) + Prettier + EditorConfig with 2-space indent, single quotes, semicolons; `.gitignore` (`node_modules`, `dist`, `.DS_Store`).
- [ ] **Step 2 (verify):** Run `npm run lint` → passes with no errors.
- [ ] **Step 3 (commit):** `chore: add eslint, prettier, editorconfig`

## Task 3: Global SCSS foundation

**Files:**
- Create: `src/sass/common/_variables.scss`, `_mixins.scss`, `_base.scss`, `_fonts.scss`, `src/sass/main.scss`

**Interfaces:**
- Produces: `main.scss` that `@use`s modern-normalize, common partials, and will `@use` each component partial (lead maintains the import list). Variables for colors, typography, and 3 breakpoints; `respond-to()` mixin.

- [ ] **Step 1:** Create variables (colors/typography/breakpoints) and `respond-to()` mixin.
- [ ] **Step 2:** Create `_base.scss` (box-sizing, container, resets) and `_fonts.scss` (@font-face or import).
- [ ] **Step 3:** `main.scss` imports normalize + common; imported in `src/main.js`.
- [ ] **Step 4 (verify):** `npm run build` → CSS emitted, no SCSS compile errors.
- [ ] **Step 5 (commit):** `feat: add global scss foundation`

## Task 4: Constants + API service

**Files:**
- Create: `src/js/constants/index.js`, `src/js/api/energyApi.js`

**Interfaces:**
- Produces:
  - `BASE_URL`, `STORAGE_KEYS`, `BREAKPOINTS`, `DEFAULT_LIMITS`.
  - `getFilters({ filter, page, limit })`
  - `getExercises({ bodypart, muscles, equipment, keyword, page, limit })`
  - `getExerciseById(id)`
  - `rateExercise(id, { rate, email, review })`
  - `getQuote()`
  - `subscribe(email)`
  - All return parsed response data (Promises); errors propagate to callers.

- [ ] **Step 1:** Define constants with exact endpoint paths from the spec.
- [ ] **Step 2:** Implement the six API functions with axios against `BASE_URL`.
- [ ] **Step 3 (verify):** `npm run build` passes; temporary dev check logs filters/quote once, then logs removed before commit.
- [ ] **Step 4 (commit):** `feat: add api service and constants`

## Task 5: Shared helpers

**Files:**
- Create: `src/js/helpers/storage.js`, `notify.js`, `pagination.js`, `loader.js`

**Interfaces:**
- Produces:
  - `storage`: `getItem(key)`, `setItem(key, value)`, `removeItem(key)` (JSON-safe, guards malformed JSON).
  - `notify`: `success(msg)`, `error(msg)` (izitoast wrappers).
  - `renderPagination({ container, totalPages, currentPage, onPage })`.
  - `loader`: `show()`, `hide()`.

- [ ] **Step 1:** Implement helpers with the signatures above.
- [ ] **Step 2 (verify):** `npm run build` + `npm run lint` pass.
- [ ] **Step 3 (commit):** `feat: add shared helpers`

## Task 6: HTML skeletons + public assets

**Files:**
- Create/Modify: `index.html`, `favorites.html`, `public/` (favicons, `site.webmanifest`, `robots.txt`), `src/images/.gitkeep`

**Interfaces:**
- Produces: section containers with stable `id`/`data-*` hooks for every ticket (`#header`, `#hero`, `#filters`, `#categories`, `#exercises`, `#search`, `#quote`, `#favorites`, `#footer`, `#loader`, `#scroll-up`). Developers render into their container via JS and do not edit HTML further.

- [ ] **Step 1:** Build `index.html` skeleton with Home containers + favicon links + font preloads.
- [ ] **Step 2:** Build `favorites.html` skeleton with Favorites containers.
- [ ] **Step 3:** Add favicons/manifest to `public/`.
- [ ] **Step 4 (verify):** `npm run build` → both pages present in `dist/`; favicon resolves.
- [ ] **Step 5 (commit):** `feat: add html skeletons and public assets`

## Task 7: Component stubs (one per ticket)

**Files:**
- Create: `src/js/components/<name>/<name>.js` + `<name>.scss` for: `header`, `footer`, `hero`, `filters`, `categories`, `exercises`, `search`, `modalExercise`, `modalRating`, `favorites`, `quote`, `loader`, `scrollUp`

**Interfaces:**
- Produces: each module exports `export function init<Name>() {}` (empty stub) and a matching SCSS partial `@use`d in `main.scss`.

- [ ] **Step 1:** Create every component folder with a no-op `init<Name>()` and an empty SCSS partial.
- [ ] **Step 2:** Register all partials in `main.scss`.
- [ ] **Step 3 (verify):** `npm run build` + `npm run lint` pass with all stubs present.
- [ ] **Step 4 (commit):** `feat: add component stubs for all tickets`

## Task 8: Wire entry points

**Files:**
- Modify: `src/main.js`, create `src/favorites.js`

**Interfaces:**
- Consumes: all `init<Name>()` from Task 7.
- Produces: `main.js` calls Home-page inits; `favorites.js` calls Favorites-page inits. Both import `main.scss`.

- [ ] **Step 1:** Import and call the relevant `init*()` in each entry file.
- [ ] **Step 2 (verify):** `npm run dev` → both pages render skeleton with zero console errors/logs.
- [ ] **Step 3 (commit):** `feat: wire entry points to component inits`

## Task 9: Team workflow docs + branches

**Files:**
- Create: `CONTRIBUTING.md`; Modify: `README.md`

**Interfaces:**
- Produces: documented Git flow (`main` protected ← `dev` ← `feat/*`), ticket→branch naming, PR + review rules, branch-cleanup rule, run/build instructions. Creates `dev` branch.

- [ ] **Step 1:** Write `CONTRIBUTING.md` (branch model, commit convention, PR checklist incl. `npm run lint`).
- [ ] **Step 2:** Rewrite `README.md` (project, scripts, structure, deploy).
- [ ] **Step 3:** Create and push `dev` branch.
- [ ] **Step 4 (commit):** `docs: add contributing guide and project readme`

## Task 10: GitHub Pages deploy

**Files:**
- Create: `.github/workflows/deploy.yml` (or add `gh-pages` script)

**Interfaces:**
- Produces: a reproducible deploy of `dist/` to `gh-pages`, respecting `base`.

- [ ] **Step 1:** Add a GitHub Actions workflow that builds and publishes `dist/` to `gh-pages` on push to `main`.
- [ ] **Step 2 (verify):** `npm run build` output paths match `base`; workflow lints clean.
- [ ] **Step 3 (commit):** `ci: add github pages deploy workflow`

---

## Notes for the team lead

- Tasks 1–8 are the blocking "day 0" layer — merge them into `main` before handing out tickets, otherwise developers are blocked on API/skeletons.
- After scaffold is merged, each of the ~10 tickets fills one `components/<name>/` folder + its SCSS partial only. Nobody edits `index.html`, `energyApi.js`, or `main.scss` import list — those stay lead-owned to avoid conflicts.
