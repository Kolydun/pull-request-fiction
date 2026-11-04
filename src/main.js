import 'modern-normalize/modern-normalize.css';
import './sass/main.scss';

import { initHeader } from './js/components/header/header.js';
import { initHero } from './js/components/hero/hero.js';
import { initFilters } from './js/components/filters/filters.js';
import { initCategories } from './js/components/categories/categories.js';
import { initSearch } from './js/components/search/search.js';
import { initExercises } from './js/components/exercises/exercises.js';
import { initQuote } from './js/components/quote/quote.js';
import { initFooter } from './js/components/footer/footer.js';
import { initLoader } from './js/components/loader/loader.js';
import { initScrollUp } from './js/components/scrollUp/scrollUp.js';
import { initModalExercise } from './js/components/modalExercise/modalExercise.js';
import { initModalRating } from './js/components/modalRating/modalRating.js';

// Home page bootstrap.
initHeader();
initHero();
initFilters();
initCategories();
initSearch();
initExercises();
initQuote();
initFooter();
initLoader();
initScrollUp();
initModalExercise();
initModalRating();
