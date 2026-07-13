(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    status.textContent = "Sending…";

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      website: form.website.value,
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
    } catch (err) {
      status.textContent = "Network error. Please try again.";
    }
  });
})();
