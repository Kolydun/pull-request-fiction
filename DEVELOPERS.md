# Інструкція для розробника

Коротко: статичну верстку пишеш у своєму partial `.html`, логіку — у `.js`, стилі — у `.css`.

## Твоя зона роботи

```
src/partials/<блок>.html    ← верстка
src/css/<блок>.css          ← стилі
src/js/<блок>.js            ← скрипт
```

Partial (`.html`), скрипти (`.js`) і  стилі (`.css`) створюєш ти. Partial підключаєш через `<load>` у сторінці, стилі — через `@import` у `src/css/main.css`. Скрипт треба імпортувати і викликати в `src/main.js` або `src/favorites.js`.

## 5 кроків

### 1. Візьми гілку від `dev`

```bash
git checkout dev && git pull
git checkout -b feat/12-header        # feat/<id>-<назва>
```

### 2. Створи partial і підключи його

Створи файл у `src/partials/`, напиши в ньому розмітку і підключи його одним `<load>` на сторінці, де цей блок має бути. Якщо блок спільний для Home і Favorites, додай рядок в обидва файли. Чужі `<load>` не змінюй.

```html
<!-- src/partials/header.html -->
<header id="header" class="header">
  <a class="header__logo" href="./index.html">YOUR ENERGY</a>
  <nav class="header__nav">
    <a class="header__link" href="./index.html">Home</a>
    <a class="header__link" href="./favorites.html">Favorites</a>
  </nav>
</header>
```

У `index.html` додай рядок туди, де блок має стояти (спільні блоки, як хедер і футер, — поза `<main>`):

```html
<load src="./partials/header.html" />
```

### 3. Картки з API збирай рядком `markup` у `.js`

Порожній список теж пишеш у своєму partial. Скрипт лише дописує в нього картки:

```html
<!-- src/partials/categories.html -->
<section id="categories" class="categories container">
  <ul class="categories__list"></ul>
  <p class="categories__empty">No categories found.</p>
</section>
```

```js
// src/js/categories.js
import { getFilters } from './api/energyApi.js';
import { FILTER_TYPES } from './constants/index.js';
import { showLoader, hideLoader } from './helpers/loader.js';

export async function initCategories() {
  const list = document.querySelector('.categories__list');
  const empty = document.querySelector('.categories__empty');
  if (!list) return;

  try {
    showLoader();
    const data = await getFilters({
      filter: FILTER_TYPES.MUSCLES,
      page: 1,
      limit: 12,
    });
    const items = data.results ?? [];

    if (!items.length) {
      empty.hidden = false;
      return;
    }

    empty.hidden = true;
    const markup = items
      .map((item) => `<li class="categories__item">${item.name}</li>`)
      .join('');
    list.insertAdjacentHTML('beforeend', markup);
  } catch (error) {
    empty.hidden = false;
  } finally {
    hideLoader();
  }
}
```

Правила:

- у `index.html` / `favorites.html` додай лише свій `<load>`, чужі рядки не змінюй;
- повторювані картки (категорії, вправи, favorites) збирай у `.js`, бо їхня кількість приходить з API або з `localStorage`;
- не замінюй увесь partial через `innerHTML` — дописуй картки в список;
- помилку лови через `try/catch` і показуй повідомлення в своєму блоці;
- `showLoader()` перед запитом, `hideLoader()` у `finally`.

### 4. Напиши стилі й підключи їх

```css
/* src/css/header.css */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .header {
    padding: 0 32px;
  }
}
```

Додай **один рядок** у `src/css/main.css` (свій, чужі не чіпай):

```css
@import './header.css';
```

Якщо є скрипт, додай його виклик у `src/main.js` або `src/favorites.js`:

```js
import { initCategories } from './js/categories.js';

initCategories();
```

### 5. Перевір і відкрий PR

```bash
npm run dev     # у браузері має з'явитись твій блок
npm run lint    # без помилок
npm run build   # збирається
```

У консолі браузера — 0 помилок і 0 `console.log`.

```bash
git add . && git commit -m "feat: add header (#12)"
git push -u origin feat/12-header
```

PR відкривай **у `dev`** (не в `main`). Назва: `[#12] Header`.

## Шпаргалка

### API (із `src/js/api/energyApi.js`)

```js
getFilters({ filter, page, limit })
getExercises({ bodypart, muscles, equipment, keyword, page, limit })
getExerciseById(id)
rateExercise(id, { rate, email, review })
getQuote()
subscribe(email)
```

Усі `async`, повертають готові дані, помилки кидають назовні.

### Лоадер (із `src/js/helpers/loader.js`)

```js
import { showLoader, hideLoader } from '../../helpers/loader.js';
```

## Спільні файли

Без потреби їх не чіпай. Свій блок збирається з partial, `.js` і `.css`.

- `index.html`, `favorites.html` — додай свій `<load>`, лише якщо блок має з’явитись на сторінці
- `src/css/main.css` — додай свій `@import`, лише щоб підключити стилі
- `src/main.js`, `src/favorites.js` — додай виклик свого `init`, лише якщо в блоці є скрипт
- `src/js/api/`, `src/js/constants/`, `src/js/helpers/`
- `src/css/common/`
