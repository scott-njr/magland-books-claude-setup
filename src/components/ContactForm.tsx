'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContact } from '@/app/actions';
import { HONEYPOT } from '@/config/site';
import { ui } from '@/config/ui';
import { INITIAL_FORM_STATE } from '@/types';

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, INITIAL_FORM_STATE);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input
        type="text"
        name={HONEYPOT.contact}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={ui.honeypot}
      />

      <div>
        <label htmlFor="contact-name" className={ui.input.label}>
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          required
          autoComplete="name"
          maxLength={100}
          className={ui.input.base}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={ui.input.label}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          maxLength={254}
          className={ui.input.base}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={ui.input.label}>
          What would you like to tell us?
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={2000}
          className={ui.textarea.base}
          rows={6}
          placeholder="A note, a question, a request — we read every one."
        />
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <SubmitButton />
        <p className="font-display italic text-taupe text-sm">
          We usually write back within a day or two.
        </p>
      </div>

      {state.message && (
        <div
          role="status"
          aria-live="polite"
          className={state.success ? ui.feedback.success : ui.feedback.error}
        >
          {state.message}
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.md}`}
    >
      {pending ? 'Sending…' : 'Send your note →'}
    </button>
  );
}
