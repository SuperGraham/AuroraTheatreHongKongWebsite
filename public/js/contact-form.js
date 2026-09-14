(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    status.textContent = "Sending…";

    const interestField = form.querySelector('input[name="interest"]:checked');
    const turnstileField = form.querySelector('[name="cf-turnstile-response"]');

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      interest: interestField ? interestField.value : "",
      message: form.message.value.trim(),
      website: form.website.value,
      turnstileToken: turnstileField ? turnstileField.value : "",
    };

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        status.textContent = "Thanks — your message has been sent. Check your inbox for a confirmation email.";
        form.reset();
      } else {
        status.textContent = result.error || "Something went wrong. Please try again.";
      }
      // Turnstile tokens are single-use. Without resetting, a retry after any
      // failure — or a second message after a success — reuses a spent token
      // and is rejected every time, which looks like the form is broken.
      if (window.turnstile) window.turnstile.reset();
    } catch (err) {
      status.textContent = "Network error. Please try again.";
      if (window.turnstile) window.turnstile.reset();
    }
  });
})();
