const toast = document.querySelector(".toast");
const toastTitle = toast.querySelector(".toast-title");
const toastText = toast.querySelector(".toast-text");
const toastIcon = toast.querySelector(".toast-icon");
const toastClose = toast.querySelector(".toast-close");

let toastTimer;

function positionToast(input) {
  const rect = input.getBoundingClientRect();

  const toastHeight = toast.offsetHeight;
  const toastWidth = toast.offsetWidth;

  const gap = 12;
  const screenPadding = 15;

  let top = rect.top - toastHeight - gap;

  top = Math.max(screenPadding, top);

  let left = rect.left + rect.width / 2 - toastWidth / 2;

  left = Math.max(
    screenPadding,
    Math.min(left, window.innerWidth - toastWidth - screenPadding),
  );

  toast.style.top = `${top}px`;
  toast.style.left = `${left}px`;
}

export function showMessage(text, type, input) {
  clearTimeout(toastTimer);

  toast.classList.remove("success", "error", "active");
  toast.classList.add(type);

  if (type === "success") {
    toastTitle.textContent = "SUCCESS";
    toastIcon.textContent = "✓";
  } else {
    toastTitle.textContent = "ERROR";
    toastIcon.textContent = "!";
  }

  toastText.textContent = text;

  toast.style.visibility = "hidden";
  positionToast(input);
  toast.style.visibility = "";

  requestAnimationFrame(() => {
    toast.classList.add("active");
  });

  toastTimer = setTimeout(closeToast, 3000);
}

export function closeToast() {
  clearTimeout(toastTimer);
  toast.classList.remove("active");
}

toastClose.addEventListener("click", closeToast);
