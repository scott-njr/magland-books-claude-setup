'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeNewsletter } from '@/app/actions';
import { HONEYPOT } from '@/config/site';
import { ui } from '@/config/ui';
import { INITIAL_FORM_STATE } from '@/types';

type Props = {
  /** Disambiguates form input ids when multiple newsletter forms render on the same page. */
  source?: string;
  /** Caveat-script tag rendered above the heading. */
  tag?: string;
  heading?: React.ReactNode;
  blurb?: string;
  /** Show the closing "— The Magland Family" Caveat sign-off. */
  showSignOff?: boolean;
};

export function NewsletterForm({
  source = 'home',
  tag = 'stay in touch',
  heading,
  blurb = 'New book announcements, free printable activities, and faith-filled resources, delivered to your inbox. Maybe once a month. Sometimes less.',
  showSignOff = true,
}: Props) {
  const [state, formAction] = useActionState(subscribeNewsletter, INITIAL_FORM_STATE);

  return (
    <section
      id="newsletter"
      className="bg-cream border-t border-[color:var(--rule)] py-20 sm:py-24 px-5 sm:px-10 text-center"
    >
      <div className="mx-auto max-w-[600px]">
        <div className={`${ui.text.tag} mb-3`}>{tag}</div>
        <h2 className={`${ui.text.h2} mb-4`}>
          {heading ?? (
            <>
              Join the <em className="italic text-rose">Magland family</em>
            </>
          )}
        </h2>
        <p className="font-body text-taupe text-[1.05rem] font-light mb-8 leading-[1.65]">
          {blurb}
        </p>

        <form action={formAction} className="text-left" noValidate>
          {/* Honeypot — bots fill, humans don't see */}
          <input
            type="text"
            name={HONEYPOT.newsletter}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className={ui.honeypot}
          />
          <div className="flex items-center gap-0 max-w-[460px] mx-auto border-b-2 border-teal pb-1">
            <label htmlFor={`newsletter-email-${source}`} className="sr-only">
              Email address
            </label>
            <input
              id={`newsletter-email-${source}`}
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="your@email.com"
              className={ui.input.underline}
            />
            <SendButton />
          </div>

          <p className="text-center font-display italic text-taupe text-[0.82rem] mt-4">
            No spam, ever — unsubscribe anytime
          </p>

          {state.message && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-5 text-center ${
                state.success ? ui.feedback.success : ui.feedback.error
              }`}
            >
              {state.message}
            </div>
          )}
        </form>

        {showSignOff && (
          <div className="mt-14 font-script text-teal text-[2.2rem]">
            — The Magland Family
          </div>
        )}
      </div>
    </section>
  );
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-display italic text-teal text-[1.1rem] font-medium hover:text-rose disabled:text-taupe transition-colors px-2 bg-transparent border-0 cursor-pointer"
    >
      {pending ? 'Sending…' : 'Send →'}
    </button>
  );
}
