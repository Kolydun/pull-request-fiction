import { subscribe } from "./api/energyApi.js";
import { showMessage } from "./toast.js";
import { showLoader, hideLoader } from "./helpers/loader.js";


const form = document.querySelector(".footer-form");
const submitButton = form?.querySelector('button[type="submit"]');
const emailInput = form?.querySelector('input[name="email"]');

if (form && submitButton && emailInput) form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
        return;
    }

    submitButton.disabled = true;

    const startTime = Date.now();

    showLoader();

    try {
        const data = await subscribe(emailInput.value.trim());

        showMessage(
            data.message || "Thank you for subscribing!",
            "success",
            emailInput
        );

        form.reset();

    } catch (error) {

        showMessage(
            error.response?.data?.message ||
            error.message ||
            "Something went wrong. Please try again.",
            "error",
            emailInput
        );

    } finally {

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 500 - elapsedTime);

        setTimeout(() => {
            hideLoader();
            submitButton.disabled = false;
        }, remainingTime);
    }
});
