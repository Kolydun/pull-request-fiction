import 'modern-normalize/modern-normalize.css';
import './sass/main.scss';

import { initHeader } from './js/components/header/header.js';
import { initFavorites } from './js/components/favorites/favorites.js';
import { initFooter } from './js/components/footer/footer.js';
import { initLoader } from './js/components/loader/loader.js';
import { initScrollUp } from './js/components/scrollUp/scrollUp.js';
import { initModalExercise } from './js/components/modalExercise/modalExercise.js';
import { initModalRating } from './js/components/modalRating/modalRating.js';

// Favorites page bootstrap.
initHeader();
initFavorites();
initFooter();
initLoader();
initScrollUp();
initModalExercise();
initModalRating();
