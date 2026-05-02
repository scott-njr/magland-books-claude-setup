# Apps Script — Newsletter and Contact intake

The Next.js app sends newsletter and contact form submissions to a Google Apps Script web app, which appends a row to a Google Sheet. This document is the one-time deployment guide.

## What you'll need

- A Google account (the one that should own the spreadsheet of subscribers).
- A Google Sheet to log into. You can create a fresh one for this. Note its ID — the long string in the URL between `/d/` and `/edit`.
- A shared secret — any random string of 32+ characters. We'll generate one in step 4.

## 1. Create the spreadsheet

1. Go to [sheets.new](https://sheets.new) and create a new spreadsheet.
2. Name it something like "Magland — Mailing List". The script will create `newsletter` and `contact` tabs automatically on first write.
3. Copy the spreadsheet ID from the URL. It looks like `1aBc...xyz`.

## 2. Create the Apps Script project

1. Go to [script.google.com](https://script.google.com) and click **New project**.
2. Name it "Magland Apps Script Bridge".
3. Replace the contents of `Code.gs` with the file at `docs/apps-script/Code.gs` from this repo.
4. Save (⌘/Ctrl + S).

## 3. Set Script Properties

1. In the Apps Script editor, click the gear icon (Project Settings) in the left sidebar.
2. Scroll to **Script Properties** and click **Add script property**.
3. Add two properties:
   - `SHEET_ID` → the spreadsheet ID from step 1.
   - `SHARED_SECRET` → a long random string. To generate one in your terminal:
     ```
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
4. Click **Save script properties**.

## 4. Deploy as a web app

1. Click **Deploy** (top right) → **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Settings:
   - Description: `magland-newsletter-and-contact-v1`
   - Execute as: **Me** (your Google account)
   - Who has access: **Anyone** (the SHARED_SECRET keeps it locked)
4. Click **Deploy**.
5. Google will ask you to authorize. Choose your account, click **Advanced** → **Go to Magland Apps Script Bridge (unsafe)** (the warning is because the script isn't published in the Google marketplace), then **Allow**.
6. Copy the **Web app URL** that ends in `/exec`. This goes into your `.env.local`.

## 5. Add to .env.local

In the Next.js project root, edit `.env.local` (create from `.env.local.example` if needed) and set:

```
APPS_SCRIPT_NEWSLETTER_URL=https://script.google.com/macros/s/AKfy.../exec
APPS_SCRIPT_CONTACT_URL=https://script.google.com/macros/s/AKfy.../exec
APPS_SCRIPT_SHARED_SECRET=the-same-secret-you-set-in-step-3
```

Both URLs can point at the same deployment — the script routes by `tab`.

Restart `npm run dev`. Newsletter and contact form submissions should now write rows into your sheet.

## Verifying it works

1. From the running site, submit the newsletter form with a test email.
2. Open the spreadsheet. You should see a `newsletter` tab with one row containing the timestamp, email, and source (`hero`, `footer`, etc.).
3. Submit the Write to Us form. A `contact` tab will appear with timestamp / email / name / message / source.

If nothing appears, in the Apps Script editor open **Executions** (clock icon in left sidebar) — failures show up there with a stack trace.

## Rotating the shared secret

If the secret leaks (commit-and-revert, screenshare, etc.):

1. Generate a new secret.
2. Update **both** the Apps Script property (Project Settings → Script Properties) **and** the Vercel env var (or `.env.local`) at the same time.
3. Redeploy the Next.js app so the new env var is live before anyone tries to submit a form.

You don't need to redeploy the Apps Script itself — Script Properties are read at request time.

## Updating the Apps Script

If you edit `Code.gs`:

1. Save in the Apps Script editor.
2. Click **Deploy** → **Manage deployments** → click the pencil icon on the existing deployment.
3. Choose **New version** in the Version dropdown, add a description, click **Deploy**.

The `/exec` URL stays the same across versions — no env var update needed.

## Schema reference

`newsletter` tab columns:

| Timestamp (ISO) | Email | Name | Source |

`contact` tab columns:

| Timestamp (ISO) | Email | Name | Message | Source |

The first row is the header (auto-frozen, bold). Subsequent rows are appended in order.
