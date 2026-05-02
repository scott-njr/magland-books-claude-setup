import { VALIDATION } from '@/config/messages';

// ─── Length limits ────────────────────────────────────────────────────────
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_STREET_LENGTH = 200;
export const MAX_CITY_LENGTH = 100;
export const MAX_STATE_LENGTH = 50;
export const MAX_ZIP_LENGTH = 10;

// ─── Pattern detectors ────────────────────────────────────────────────────
const HTML_TAG_REGEX = /<[^>]*>/g;
const SCRIPT_PATTERN_REGEX = /javascript:|on\w+\s*=|<script|<\/script/gi;
const SQL_INJECTION_REGEX = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b\s)/gi;
const PROMPT_INJECTION_REGEX = /(ignore\s+(previous|above|all|prior|my)\s+(instructions|prompts?|rules?|context)|system\s*prompt|you\s+are\s+now|act\s+as\s+a|pretend\s+(you\s+are|to\s+be)|disregard\s+(all|any|previous|the\s+above)|bypass\s+(safety|filter|content|restrict)|jailbreak|do\s+anything\s+now|dan\s+mode|forget\s+(what|everything|all|your)|new\s+instructions|override\s+(your|the|all)|reveal\s+(your|the|system)|repeat\s+(back|your)\s+(system|instructions|prompt))/gi;

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ' -]+$/;
const STREET_REGEX = /^[a-zA-Z0-9À-ÿ ,.'#/-]+$/;
const CITY_REGEX = /^[a-zA-ZÀ-ÿ ,.'-]+$/;
const STATE_REGEX = /^[a-zA-Z ]{2,}$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

function stripHtmlTags(input: string): string {
  // Strip HTML tags defensively. We deliberately do NOT entity-encode quotes/apostrophes here:
  // React auto-escapes at render time, and encoding here breaks legitimate names like "O'Brien".
  // Output-side encoding is the consumer's responsibility (email templates, raw HTML embeds).
  return input.replace(HTML_TAG_REGEX, '');
}

function containsMaliciousPatterns(input: string): boolean {
  return (
    SCRIPT_PATTERN_REGEX.test(input) ||
    SQL_INJECTION_REGEX.test(input) ||
    PROMPT_INJECTION_REGEX.test(input)
  );
}

export function sanitizeText(input: string, maxLength: number): string {
  const trimmed = input.trim();
  const stripped = stripHtmlTags(trimmed);
  return stripped.slice(0, maxLength);
}

// ─── Result type ──────────────────────────────────────────────────────────
export type ValidationResult =
  | { valid: true; value: string }
  | { valid: false; error: string };

// ─── Validators ───────────────────────────────────────────────────────────
export function validateName(input: unknown, fieldName: string): ValidationResult {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return { valid: false, error: VALIDATION.required(fieldName) };
  }

  const sanitized = sanitizeText(input, MAX_NAME_LENGTH);

  if (containsMaliciousPatterns(input)) {
    return { valid: false, error: VALIDATION.invalidChars(fieldName) };
  }

  if (!NAME_REGEX.test(sanitized)) {
    return { valid: false, error: VALIDATION.invalidChars(fieldName) };
  }

  return { valid: true, value: sanitized };
}

export function validateOptionalName(
  input: unknown,
  fieldName: string,
): ValidationResult {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return { valid: true, value: '' };
  }

  const sanitized = sanitizeText(input, MAX_NAME_LENGTH);

  if (containsMaliciousPatterns(input)) {
    return { valid: false, error: VALIDATION.invalidChars(fieldName) };
  }

  if (!NAME_REGEX.test(sanitized)) {
    return { valid: false, error: VALIDATION.invalidChars(fieldName) };
  }

  return { valid: true, value: sanitized };
}

export function validateEmail(input: unknown): ValidationResult {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return { valid: false, error: VALIDATION.emailRequired };
  }

  const sanitized = sanitizeText(input, MAX_EMAIL_LENGTH).toLowerCase();

  if (containsMaliciousPatterns(input)) {
    return { valid: false, error: VALIDATION.invalidEmail };
  }

  if (!EMAIL_REGEX.test(sanitized)) {
    return { valid: false, error: VALIDATION.invalidEmail };
  }

  return { valid: true, value: sanitized };
}

export function validateMessage(input: unknown): ValidationResult {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return { valid: false, error: VALIDATION.messageRequired };
  }

  const sanitized = sanitizeText(input, MAX_MESSAGE_LENGTH);

  if (containsMaliciousPatterns(input)) {
    return { valid: false, error: VALIDATION.invalidContent };
  }

  return { valid: true, value: sanitized };
}

// ─── Address validators (used in checkout phase) ───────────────────────────
export function validateStreet(input: unknown): ValidationResult {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return { valid: false, error: VALIDATION.addressRequired('Street') };
  }
  const sanitized = sanitizeText(input, MAX_STREET_LENGTH);
  if (containsMaliciousPatterns(input) || !STREET_REGEX.test(sanitized)) {
    return { valid: false, error: VALIDATION.invalidAddress('Street') };
  }
  return { valid: true, value: sanitized };
}

export function validateCity(input: unknown): ValidationResult {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return { valid: false, error: VALIDATION.addressRequired('City') };
  }
  const sanitized = sanitizeText(input, MAX_CITY_LENGTH);
  if (containsMaliciousPatterns(input) || !CITY_REGEX.test(sanitized)) {
    return { valid: false, error: VALIDATION.invalidAddress('City') };
  }
  return { valid: true, value: sanitized };
}

export function validateState(input: unknown): ValidationResult {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return { valid: false, error: VALIDATION.addressRequired('State') };
  }
  const sanitized = sanitizeText(input, MAX_STATE_LENGTH).toUpperCase();
  if (containsMaliciousPatterns(input) || !STATE_REGEX.test(sanitized)) {
    return { valid: false, error: VALIDATION.invalidAddress('State') };
  }
  return { valid: true, value: sanitized };
}

export function validateZip(input: unknown): ValidationResult {
  if (typeof input !== 'string' || input.trim().length === 0) {
    return { valid: false, error: VALIDATION.addressRequired('ZIP code') };
  }
  const sanitized = sanitizeText(input, MAX_ZIP_LENGTH);
  if (!ZIP_REGEX.test(sanitized)) {
    return { valid: false, error: VALIDATION.invalidZip };
  }
  return { valid: true, value: sanitized };
}

export type AddressValidationResult =
  | {
      valid: true;
      value: { street: string; city: string; state: string; zip: string };
    }
  | { valid: false; errors: Partial<Record<'street' | 'city' | 'state' | 'zip', string>> };

export function validateAddress(input: {
  street: unknown;
  city: unknown;
  state: unknown;
  zip: unknown;
}): AddressValidationResult {
  const street = validateStreet(input.street);
  const city = validateCity(input.city);
  const state = validateState(input.state);
  const zip = validateZip(input.zip);

  const errors: Partial<Record<'street' | 'city' | 'state' | 'zip', string>> = {};
  if (!street.valid) errors.street = street.error;
  if (!city.valid) errors.city = city.error;
  if (!state.valid) errors.state = state.error;
  if (!zip.valid) errors.zip = zip.error;

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  // All valid — narrow types
  if (street.valid && city.valid && state.valid && zip.valid) {
    return {
      valid: true,
      value: {
        street: street.value,
        city: city.value,
        state: state.value,
        zip: zip.value,
      },
    };
  }
  // Unreachable but satisfies the type checker
  return { valid: false, errors };
}
