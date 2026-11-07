import cardTemplate from '../../partials/exercises/exercise-card.html?raw';
import iconStar from '../../images/icons/icon-star.svg';
import iconRun from '../../images/icons/icon-run.svg';
import iconArrow from '../../images/icons/icon-arrow.svg';
import iconTrash from '../../images/icons/icon-trash.svg';

const ICONS = {
  star: iconStar,
  run: iconRun,
  arrow: iconArrow,
  trash: iconTrash,
};

const template = document.createElement('template');
template.innerHTML = cardTemplate.trim();

function sentenceCase(value) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function titleCase(value) {
  return String(value ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function createExerciseCardMarkup(exercise = {}, variant = 'home') {
  const card = template.content.firstElementChild.cloneNode(true);
  const id = String(exercise._id ?? '');
  const rating = card.querySelector('[data-rating]');
  const remove = card.querySelector('[data-exercise-remove]');

  card.dataset.id = id;
  card.querySelectorAll('[data-icon]').forEach((img) => {
    img.src = ICONS[img.dataset.icon];
  });
  card.querySelector('[data-exercise-start]').dataset.id = id;
  card.querySelector('[data-name]').textContent = sentenceCase(exercise.name);
  card.querySelector('[data-calories]').textContent =
    `${exercise.burnedCalories ?? 0} / 3 min`;
  card.querySelector('[data-bodypart]').textContent = titleCase(
    exercise.bodyPart
  );
  card.querySelector('[data-target]').textContent = titleCase(exercise.target);

  if (variant === 'favorites') {
    rating.remove();
    remove.dataset.id = id;
  } else {
    remove.remove();
    const number = Number(exercise.rating);
    rating.querySelector('[data-rating-value]').textContent = Number.isFinite(
      number
    )
      ? number.toFixed(1)
      : '0.0';
  }

  return card.outerHTML;
}
