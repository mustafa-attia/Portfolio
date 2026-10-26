import { useEffect, useRef } from "react";
import type { FormEvent } from "react";
import "./ContactModal.css";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    nameInputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'input:not(:disabled), textarea:not(:disabled), button:not(:disabled)',
      );
      const first = focusable.item(0);
      const last = focusable.item(focusable.length - 1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function sendToWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = [
      "Hello Mustafa, I'd like to discuss a project.",
      "",
      `Name: ${String(formData.get("name") ?? "").trim()}`,
      `Email: ${String(formData.get("email") ?? "").trim()}`,
      `Position: ${String(formData.get("position") ?? "").trim()}`,
      `Business: ${String(formData.get("business") ?? "").trim()}`,
      "",
      `Message: ${String(formData.get("message") ?? "").trim()}`,
    ].join("\n");
    const whatsappUrl = `https://wa.me/201012792218?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div
      className="contact-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="contact-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-description"
      >
        <p className="contact-modal-eyebrow">LET&apos;S START A CONVERSATION</p>
        <h2 id="contact-modal-title" className="contact-modal-title">
          Tell me about your <em>idea.</em>
        </h2>
        <p id="contact-modal-description" className="contact-modal-description">
          Share a few details and continue directly in WhatsApp.
        </p>

        <form className="contact-modal-form" onSubmit={sendToWhatsApp}>
          <div className="contact-modal-grid">
            <label>
              Name
              <input
                ref={nameInputRef}
                name="name"
                type="text"
                autoComplete="name"
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </label>
            <label>
              Position
              <input name="position" type="text" autoComplete="organization-title" required />
            </label>
            <label>
              Business
              <input name="business" type="text" autoComplete="organization" required />
            </label>
          </div>

          <label>
            Message
            <textarea name="message" rows={4} required />
          </label>

          <div className="contact-modal-actions">
            <button className="contact-modal-send" type="submit">
              Continue in WhatsApp <span aria-hidden="true">↗</span>
            </button>
            <button
              className="contact-modal-cancel"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
