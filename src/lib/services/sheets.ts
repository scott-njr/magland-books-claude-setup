/**
 * Google Apps Script web-app webhook bridge.
 *
 * Newsletter and contact form submissions are POSTed to an Apps Script Web App
 * that appends a row to a Google Sheet. The script is deployed by the user
 * (one-time) and we authenticate via a shared secret.
 *
 * Real wiring is added in the integration phase — for now the function is a
 * thin client that returns ok/err shapes the action layer can consume.
 */

export type SheetTab = 'newsletter' | 'contact';

export type AppendPayload = {
  tab: SheetTab;
  email: string;
  name?: string;
  message?: string;
  source?: string;
};

type AppendResult = { ok: true } | { ok: false; reason: string };

function getEndpointForTab(tab: SheetTab): string | undefined {
  if (tab === 'newsletter') {
    return process.env.APPS_SCRIPT_NEWSLETTER_URL;
  }
  return process.env.APPS_SCRIPT_CONTACT_URL;
}

/**
 * Append a row to the configured Google Sheet via Apps Script web app.
 *
 * In phase 1 (this scaffold) we no-op when env vars are missing so local dev
 * doesn't error. Phase 2 (integration) will require the env vars and surface
 * failures to the action layer for user-friendly error messaging.
 */
export async function appendToSheet(payload: AppendPayload): Promise<AppendResult> {
  const endpoint = getEndpointForTab(payload.tab);
  const secret = process.env.APPS_SCRIPT_SHARED_SECRET;

  if (!endpoint || !secret) {
    // TODO(phase-2): Once Apps Script is deployed, treat missing env as a hard error.
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, reason: 'sheets-not-configured' };
    }
    return { ok: true };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, ...payload }),
      // Apps Script web apps follow a 302 to a usercontent URL — fetch follows by default.
      redirect: 'follow',
    });

    if (!response.ok) {
      return { ok: false, reason: `sheets-${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'sheets-network';
    return { ok: false, reason };
  }
}
