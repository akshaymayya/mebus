const MAX_MESSAGE = 2000;
const MAX_NAME = 80;
const MAX_EMAIL = 254;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function setupContactForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;

  const successBox = form.querySelector<HTMLElement>("[data-form-success]");
  const errorBox = form.querySelector<HTMLElement>("[data-form-error]");
  const submitButton = form.querySelector<HTMLButtonElement>("[data-submit]");
  const messageField = form.querySelector<HTMLTextAreaElement>("#message");
  const nameField = form.querySelector<HTMLInputElement>("#name");
  const emailField = form.querySelector<HTMLInputElement>("#email");
  const honeypot = form.querySelector<HTMLInputElement>('input[name="_gotcha"]');
  const botCheck = form.querySelector<HTMLInputElement>('input[name="botcheck"]');
  const counter = form.querySelector<HTMLElement>("[data-message-count]");

  if (!successBox || !errorBox || !submitButton || !messageField || !emailField) {
    return;
  }

  const endpoint = (form.dataset.endpoint ?? "").trim();
  const originalLabel = submitButton.textContent ?? "Send message";
  let sending = false;

  const updateCount = () => {
    if (counter) counter.textContent = String(messageField.value.length);
  };

  const hideStatus = () => {
    successBox.hidden = true;
    errorBox.hidden = true;
    successBox.textContent = "";
    errorBox.textContent = "";
  };

  const showSuccess = (text: string) => {
    errorBox.hidden = true;
    errorBox.textContent = "";
    successBox.textContent = text;
    successBox.hidden = false;
  };

  const showError = (text: string) => {
    successBox.hidden = true;
    successBox.textContent = "";
    errorBox.textContent = text;
    errorBox.hidden = false;
  };

  const setInvalid = (
    field: HTMLInputElement | HTMLTextAreaElement,
    invalid: boolean,
  ) => {
    if (invalid) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  };

  updateCount();

  messageField.addEventListener("input", () => {
    updateCount();
    setInvalid(messageField, false);
  });

  emailField.addEventListener("input", () => {
    setInvalid(emailField, false);
  });

  form.addEventListener("input", hideStatus);
  form.addEventListener("reset", updateCount);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    hideStatus();
    setInvalid(messageField, false);
    setInvalid(emailField, false);

    // A filled honeypot means a bot. Pretend it worked and send nothing.
    if ((honeypot?.value ?? "").length > 0 || botCheck?.checked) {
      showSuccess("Thanks — your message is with me.");
      form.reset();
      return;
    }

    const message = messageField.value.trim();
    const name = nameField?.value.trim() ?? "";
    const email = emailField.value.trim();

    if (message.length < 1) {
      setInvalid(messageField, true);
      showError("Please write a message before sending.");
      messageField.focus();
      return;
    }

    if (email.length < 1) {
      setInvalid(emailField, true);
      showError("Please add your email so I can reply.");
      emailField.focus();
      return;
    }

    if (!emailField.validity.valid) {
      setInvalid(emailField, true);
      showError("Please enter a valid email address.");
      emailField.focus();
      return;
    }

    if (message.length > MAX_MESSAGE || name.length > MAX_NAME || email.length > MAX_EMAIL) {
      showError("That message is too long. Please shorten it and try again.");
      return;
    }

    if (!endpoint) {
      showError("The form isn’t connected yet. Please try again later.");
      return;
    }

    sending = true;
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      let payload: unknown = null;
      try {
        payload = await response.json();
      } catch {
        // Some services return an empty body. The status code is enough.
      }

      const serviceRejected =
        isRecord(payload) && payload.success === false;

      if (!response.ok || serviceRejected) {
        throw new Error("Form service rejected the message");
      }

      showSuccess(
        "Thanks — your message is with me. I’ll reply to your email.",
      );
      form.reset();
      updateCount();
    } catch {
      showError(
        "Something went wrong and your message wasn’t sent. Please try again.",
      );
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
}
