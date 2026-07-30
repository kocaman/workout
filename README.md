# Ledger — Workout Logger

A mobile-friendly page for logging sets straight into a Google Sheet. No app, no login — just a page and
a sheet.

## Files

| File | What it is |
|---|---|
| `workout-logger.html` | The page itself. Host it anywhere or open it locally. |
| `AppsScript_Code.gs` | The backend. Runs inside your Google Sheet, receives data from the page. |

## How it fits together

```
[workout-logger.html]  --POST/GET-->  [Apps Script Web App]  --->  [Google Sheet]
     (your phone)                     (script.google.com URL)      (Workouts tab)
```

A Sheets API key can only *read* a public sheet — it can't write to it.
Writing needs either OAuth or a script running with your own permissions.
Apps Script is the second option: it deploys as a plain URL, but every
request it handles runs with your Google account's access, so it can append
rows to your sheet.

## One-time setup

### 1. Create the sheet
- New Google Sheet.
- Add a tab named exactly `Workouts`.
- Row 1 headers: `Timestamp | Date | Session | Exercise | SetNumber | Weight | Reps | RIR | Done`

### 2. Deploy the backend
- In the sheet: Extensions → Apps Script.
- Delete the placeholder code, paste in `AppsScript_Code.gs`, save.
- Deploy → New deployment → type **Web app**.
  - Execute as: **Me**
  - Who has access: **Anyone**
- Copy the URL it gives you (ends in `/exec`) — this is your API endpoint.
- Any time you edit the script, you must redeploy: Deploy → Manage
  deployments → pencil icon → Version: New version → Deploy. Editing the
  code alone does not update the live URL's behavior.

### 3. Connect the page to the sheet
- Open `workout-logger.html`.
- Paste the Apps Script URL into the **Log** tab's URL field, click Save.
- It's stored in the browser's local storage on that device — you only
  enter it once per device/browser.

### 4. Host it so your phone can open it as a real page
Opening the raw `.html` file from Files/Drive on a phone often tries to
download it instead of running it. Easiest fixes:
- **GitHub Pages** (free, needs a public repo unless you're on GitHub Pro) —
  push the file to a repo, enable Pages in Settings, get a permanent URL.
- **Netlify Drop** (app.netlify.com/drop) — drag the file in, get an instant
  URL, no account needed.
- Or just use your phone browser's "Open in Chrome/Safari" share option
  instead of tapping the file directly.

## Using it

### Log tab
Pick a session (A/B/C), pick an exercise, enter weight and reps, hit Enter
or tap **Log set**. Each submission appends one row to the sheet.

After a set logs, a rest timer starts automatically using that exercise's
target rest time from the program (e.g. 180s for Back Squat, 60s for Cable
Curl). It beeps and vibrates when it hits zero. You can adjust ±15s, pause,
or skip it.

### Program tab
Read-only reference — all three sessions with target sets, reps, RIR, rest
time, and coaching cue per exercise. Pulled from the same program data as
`ledger.jsx`, no sheet connection needed.

### History tab
Tap **Refresh history** to pull your logged sets back from the sheet,
grouped by exercise, showing your PR (heaviest logged set) and the 5 most
recent entries per lift.

## Security note

The page's HTML/JS being public (e.g. in a public GitHub repo) does not by
itself let anyone write to your sheet. The Apps Script URL is what
authorizes writes, and it isn't stored in the file — only in your own
browser's local storage after you paste it in. As long as you don't share
that URL publicly, your sheet is safe even with the page hosted publicly.

## Troubleshooting

- **"Failed to reach the sheet"** — open the Apps Script URL directly in a
  browser; you should see "Ledger workout logger is running." If not, the
  deployment or URL is wrong. Also confirm the sheet tab is named exactly
  `Workouts`.
- **History won't load** — make sure you redeployed the script after the
  `doGet` history code was added (see step 2 above).
- **Page won't open on phone** — see the hosting section above.
