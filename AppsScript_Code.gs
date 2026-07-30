/**
 * LEDGER — Google Sheets backend
 * -------------------------------
 * 1. Create a Google Sheet.
 * 2. Add a tab named exactly: Workouts
 *    Row 1 headers: Timestamp | Date | Session | Exercise | SetNumber | Weight | Reps | RIR | Done
 * 3. Extensions > Apps Script, delete the default code, paste this in, save.
 * 4. Deploy > New deployment > type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Copy the Web app URL it gives you — that's what goes into the HTML page.
 * 6. Re-deploy (Deploy > Manage deployments > Edit > New version) any time you edit this file.
 */

const SHEET_NAME = "Workouts";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.date || "",
    data.session || "",
    data.exercise || "",
    data.setNumber || "",
    data.weight || "",
    data.reps || "",
    data.rir || "",
    data.done ? "TRUE" : "FALSE"
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e.parameter.action === "history") {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const values = sheet.getDataRange().getValues();
    const headers = values.shift();
    const rows = values.map(r => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = r[i]; });
      return obj;
    });
    return ContentService
      .createTextOutput(JSON.stringify(rows))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput("Ledger workout logger is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
