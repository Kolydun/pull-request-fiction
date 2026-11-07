import 'modern-normalize/modern-normalize.css';
import './css/main.css';
import { initCategories } from './js/categories.js';
import { initExercises } from './js/exercises/exercises.js';
import { initQuote } from './js/quote.js';
import { initModal } from './js/exercise-modal.js';

initCategories();
initExercises();
initQuote();
initModal();
