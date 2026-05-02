/**
 * Magland Books — Apps Script web app for newsletter + contact form intake.
 *
 * Paste this file into a new Google Apps Script project bound to (or pointing at)
 * the Magland Books mailing-list spreadsheet. Set Script Properties:
 *   - SHARED_SECRET   the same value used in .env.local APPS_SCRIPT_SHARED_SECRET
 *   - SHEET_ID        the spreadsheet ID from its URL
 *
 * Deploy: Deploy > New deployment > type "Web app".
 *   Execute as:   Me (your Google account)
 *   Who has access: Anyone
 * Copy the deployed /exec URL into:
 *   APPS_SCRIPT_NEWSLETTER_URL=
 *   APPS_SCRIPT_CONTACT_URL=
 * (Both can be the same URL — the script routes by `tab`.)
 *
 * The spreadsheet must contain two tabs: `newsletter` and `contact`.
 * If they don't exist, the script creates them and writes a header row.
 */

const NEWSLETTER_HEADERS = ['Timestamp (ISO)', 'Email', 'Name', 'Source'];
const CONTACT_HEADERS = ['Timestamp (ISO)', 'Email', 'Name', 'Message', 'Source'];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, reason: 'no-body' });
    }

    const body = JSON.parse(e.postData.contents);

    const expectedSecret = PropertiesService
      .getScriptProperties()
      .getProperty('SHARED_SECRET');
    if (!expectedSecret || body.secret !== expectedSecret) {
      return jsonResponse({ ok: false, reason: 'unauthorized' });
    }

    const sheetId = PropertiesService
      .getScriptProperties()
      .getProperty('SHEET_ID');
    if (!sheetId) {
      return jsonResponse({ ok: false, reason: 'sheet-not-configured' });
    }

    const tab = body.tab;
    if (tab !== 'newsletter' && tab !== 'contact') {
      return jsonResponse({ ok: false, reason: 'invalid-tab' });
    }

    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ensureSheet(ss, tab);

    const timestamp = new Date().toISOString();
    const email = String(body.email || '').slice(0, 254);
    const name = String(body.name || '').slice(0, 100);
    const source = String(body.source || '').slice(0, 60);

    if (tab === 'newsletter') {
      sheet.appendRow([timestamp, email, name, source]);
    } else {
      const message = String(body.message || '').slice(0, 2000);
      sheet.appendRow([timestamp, email, name, message, source]);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, reason: 'exception', detail: String(err) });
  }
}

function ensureSheet(ss, tab) {
  let sheet = ss.getSheetByName(tab);
  if (!sheet) {
    sheet = ss.insertSheet(tab);
  }
  if (sheet.getLastRow() === 0) {
    const headers = tab === 'newsletter' ? NEWSLETTER_HEADERS : CONTACT_HEADERS;
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
