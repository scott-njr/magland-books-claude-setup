'use server';

import { checkRateLimit } from '@/lib/rate-limit';
import { addToNewsletterAudience, sendContactEmail } from '@/lib/services/resend';
import {
  validateEmail,
  validateMessage,
  validateName,
  validateOptionalName,
} from '@/lib/validation';
import { ERRORS, HONEYPOT_DECOY, SUCCESS } from '@/config/messages';
import { HONEYPOT } from '@/config/site';
import type { FormState } from '@/types';

const NEWSLETTER_RATE_LIMIT = { max: 5, windowSeconds: 60 };
const CONTACT_RATE_LIMIT = { max: 3, windowSeconds: 60 };

export async function subscribeNewsletter(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { allowed } = await checkRateLimit(
    'newsletter',
    NEWSLETTER_RATE_LIMIT.max,
    NEWSLETTER_RATE_LIMIT.windowSeconds,
  );
  if (!allowed) {
    return { success: false, message: ERRORS.rateLimited };
  }

  // Honeypot — bots fill the hidden 'website' field, real users don't.
  const honeypot = formData.get(HONEYPOT.newsletter);
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { success: true, message: HONEYPOT_DECOY.newsletter };
  }

  const emailField = formData.get('email');
  const nameField = formData.get('name');

  const email = validateEmail(emailField);
  if (!email.valid) {
    return { success: false, message: email.error };
  }

  const name = validateOptionalName(nameField, 'Name');
  if (!name.valid) {
    return { success: false, message: name.error };
  }

  const result = await addToNewsletterAudience({
    email: email.value,
    name: name.value || undefined,
  });

  if (!result.ok) {
    return { success: false, message: ERRORS.network };
  }

  return { success: true, message: SUCCESS.newsletterSubscribed };
}

export async function submitContact(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { allowed } = await checkRateLimit(
    'contact',
    CONTACT_RATE_LIMIT.max,
    CONTACT_RATE_LIMIT.windowSeconds,
  );
  if (!allowed) {
    return { success: false, message: ERRORS.rateLimited };
  }

  const honeypot = formData.get(HONEYPOT.contact);
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { success: true, message: HONEYPOT_DECOY.contact };
  }

  const nameField = formData.get('name');
  const emailField = formData.get('email');
  const messageField = formData.get('message');

  const name = validateName(nameField, 'Name');
  if (!name.valid) {
    return { success: false, message: name.error };
  }
  const email = validateEmail(emailField);
  if (!email.valid) {
    return { success: false, message: email.error };
  }
  const message = validateMessage(messageField);
  if (!message.valid) {
    return { success: false, message: message.error };
  }

  const result = await sendContactEmail({
    name: name.value,
    email: email.value,
    message: message.value,
  });

  if (!result.ok) {
    return { success: false, message: ERRORS.network };
  }

  return { success: true, message: SUCCESS.contactSubmitted };
}
