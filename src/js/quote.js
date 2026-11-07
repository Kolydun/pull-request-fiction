import { getQuote } from './api/energyApi.js';
import { showLoader, hideLoader } from './helpers/loader.js';

const QUOTE_STORAGE_KEY = 'yourEnergy.quote';

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readSavedQuote() {
  try {
    const raw = localStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (
      !saved ||
      typeof saved.text !== 'string' ||
      !saved.text.trim() ||
      typeof saved.author !== 'string' ||
      typeof saved.date !== 'string'
    ) {
      return null;
    }
    return saved;
  } catch {
    // Storage may be disabled or contain malformed data.
    return null;
  }
}

function writeSavedQuote(quote) {
  try {
    localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(quote));
  } catch {
    // The quote remains visible even if saving is unavailable.
  }
}

function renderQuote(root, { text, author }) {
  root.querySelector('[data-quote-text]').textContent = text;
  root.querySelector('[data-quote-author]').textContent = author;
}

export async function initQuote() {
  const root = document.querySelector('.quote');
  if (!root) return;

  const errorElement = root.querySelector('[data-quote-error]');
  const saved = readSavedQuote();
  const today = getLocalDate();

  if (saved?.date === today) {
    renderQuote(root, saved);
    return;
  }

  showLoader();
  try {
    const response = await getQuote();
    const text = response?.quote ?? response?.text;
    const author = response?.author ?? 'Unknown author';

    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('Unexpected quote response');
    }

    const quote = {
      text: text.trim(),
      author: typeof author === 'string' ? author : 'Unknown author',
      date: today,
    };
    writeSavedQuote(quote);
    renderQuote(root, quote);
  } catch {
    if (saved) {
      renderQuote(root, saved);
      errorElement.textContent = 'Showing the last available quote.';
    } else {
      root.querySelector('[data-quote-text]').textContent =
        'Your daily inspiration is temporarily unavailable.';
      root.querySelector('[data-quote-author]').textContent = '';
      errorElement.textContent = 'Please try again later.';
    }
    errorElement.hidden = false;
  } finally {
    hideLoader();
  }
}
