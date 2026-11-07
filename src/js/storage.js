const FAVORITES_KEY = 'yourEnergy.favorites';
export const FAVORITES_CHANGED_EVENT = 'favorites:changed';

export function getFavorites() {
  try {
    const parsed = JSON.parse(localStorage.getItem(FAVORITES_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavorites().some((exercise) => exercise._id === id);
}

export function addFavorite(exercise) {
  if (!exercise?._id || isFavorite(exercise._id)) return getFavorites();

  const favorites = [...getFavorites(), exercise];
  saveFavorites(favorites);
  return favorites;
}

export function removeFavorite(id) {
  const favorites = getFavorites().filter((exercise) => exercise._id !== id);
  saveFavorites(favorites);
  return favorites;
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // Storage is full or blocked (private mode): keep the UI working anyway.
  }

  document.dispatchEvent(
    new CustomEvent(FAVORITES_CHANGED_EVENT, { detail: { favorites } })
  );
}
