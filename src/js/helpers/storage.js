// JSON-safe localStorage wrapper.
// Guards against malformed JSON so a corrupt entry never crashes the app.
export const storage = {
  getItem(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      // Corrupted value — drop it and behave as if empty.
      localStorage.removeItem(key);
      return null;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage unavailable — fail silently.
    }
  },

  removeItem(key) {
    localStorage.removeItem(key);
  },
};
