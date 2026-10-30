(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    status.textContent = "Sending…";

    // Never read the hidden cf-turnstile-response input directly. On a page
    // that has been open a few minutes — or in a background tab, where the
    // widget's refresh timers are throttled — that token is already expired,
    // and the visitor gets an unexplained failure on a message they have just
    // written. See js/turnstile.js for the full reasoning.
    const turnstileToken = await window.freshTurnstile.token({
      onChallenge: function () { status.textContent = "Checking you are human…"; },
    });
    if (!turnstileToken) {
      status.textContent = "Could not complete the verification check. If you block scripts, "
        + "allow challenges.cloudflare.com and try again.";
      return;
    }

    status.textContent = "Sending…";

    const interestField = form.querySelector('input[name="interest"]:checked');

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      interest: interestField ? interestField.value : "",
      message: form.message.value.trim(),
      website: form.website.value, // honeypot
      turnstileToken,
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
        window.freshTurnstile.reset();
      } else {
        status.textContent = result.error || "Something went wrong. Please try again.";
        // The token has been spent either way, so clear it along with the
        // widget — otherwise a retry posts a token the backend already saw.
        window.freshTurnstile.reset();
      }
    } catch (err) {
      status.textContent = "Network error. Please try again.";
      window.freshTurnstile.reset();
    }
  });
})();
