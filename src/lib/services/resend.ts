/**
 * Resend bridge — transactional email + newsletter audience management.
 *
 * Two responsibilities, deliberately split:
 *   - sendContactEmail: visitor's "Drop us a line" message → email to Summer
 *     (replyTo is set to the visitor so hitting Reply in Gmail responds to them).
 *   - addToNewsletterAudience: newsletter signup → adds to the Resend audience
 *     that handles unsubscribe + future broadcasts.
 *
 * Dev mode (no RESEND_API_KEY): both functions no-op and return ok, so local
 * development doesn't need credentials. Production REQUIRES the env vars.
 */
import { Resend } from 'resend';
import { CONTACT_FROM_EMAIL, CONTACT_NOTIFY_EMAIL } from '@/config/site';

type Result = { ok: true } | { ok: false; reason: string };

let cachedClient: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!cachedClient) cachedClient = new Resend(apiKey);
  return cachedClient;
}

function devNoOpOrError(): Result {
  if (process.env.NODE_ENV === 'production') {
    return { ok: false, reason: 'resend-not-configured' };
  }
  return { ok: true };
}

export type ContactEmailPayload = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactEmail(payload: ContactEmailPayload): Promise<Result> {
  const client = getClient();
  if (!client) return devNoOpOrError();

  const subject = `Magland: new message from ${payload.name}`;
  const text = [
    'A new message just came in via maglandbooks.com.',
    '',
    `Name:    ${payload.name}`,
    `Email:   ${payload.email}`,
    '',
    'Message:',
    payload.message,
    '',
    `— Hit Reply to respond directly to ${payload.email}.`,
  ].join('\n');

  try {
    const { error } = await client.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_NOTIFY_EMAIL],
      replyTo: payload.email,
      subject,
      text,
    });
    if (error) {
      return { ok: false, reason: `resend-${error.name ?? 'send-failed'}` };
    }
    return { ok: true };
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'resend-network';
    return { ok: false, reason };
  }
}

export type NewsletterSignupPayload = {
  email: string;
  name?: string;
};

export async function addToNewsletterAudience(
  payload: NewsletterSignupPayload,
): Promise<Result> {
  const client = getClient();
  const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;
  if (!client || !audienceId) return devNoOpOrError();

  // Split a single name field into first/last on the first space — Resend's
  // contacts API stores them separately. Best-effort; users can be just "Lila".
  const firstName = payload.name?.split(' ')[0] ?? undefined;
  const lastName = payload.name?.split(' ').slice(1).join(' ') || undefined;

  try {
    const { error } = await client.contacts.create({
      audienceId,
      email: payload.email,
      firstName,
      lastName,
      unsubscribed: false,
    });
    if (error) {
      // Resend returns a validation error when the email is already in the
      // audience. Treat as success — newsletter signup is idempotent.
      const msg = (error.message ?? '').toLowerCase();
      if (msg.includes('already exists') || msg.includes('contact already')) {
        return { ok: true };
      }
      return { ok: false, reason: `resend-${error.name ?? 'audience-failed'}` };
    }
    return { ok: true };
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'resend-network';
    return { ok: false, reason };
  }
}
