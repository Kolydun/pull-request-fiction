import 'modern-normalize/modern-normalize.css';
import './css/main.css';
import { initHeader } from './js/header.js';
import { initCategories } from './js/categories.js';
import { initExercises } from './js/exercises/exercises.js';
import { initQuote } from './js/quote.js';
import { initModal } from './js/exercise-modal.js';
import { initRating } from './js/rating-modal.js';
import './js/notify.js';

initHeader();
initCategories();
initExercises();
initQuote();
initModal();
initRating();
