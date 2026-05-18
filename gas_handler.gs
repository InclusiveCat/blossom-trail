// ═══════════════════════════════════════════════════════════════════════
// BLOSSOM TRAIL — Google Apps Script Handler
// Paste this ENTIRE script into the Apps Script editor, then:
//   Deploy → Manage Deployments → New Deployment
//   Type: Web app | Execute as: Me | Who has access: Anyone
// ═══════════════════════════════════════════════════════════════════════

const SURVEY_SHEET = 'Sheet1';    // ← change to your survey tab name if different
const VAN_SHEET   = 'VanTracker'; // auto-created if it doesn't exist

// ── SURVEY SUBMISSION (POST) ────────────────────────────────────────────
function doPost(e) {
  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SURVEY_SHEET) || ss.getActiveSheet();

    // e.parameters returns ARRAYS — required for multi-select checkboxes (Help field)
    var p = e.parameters || {};

    function g(name) {
      if (!p[name]) return '';
      return p[name].filter(Boolean).join('; ');
    }

    // Honeypot: silently drop bot submissions
    if (g('bot_check')) {
      return ok('bot_dropped');
    }

    var row = [
      new Date(),                  // Timestamp
      g('Blossom UUID'),           // Blossom UUID
      g('Gender'),                 // Gender
      g('Gender Other'),           // Gender Other  ← "Prefer to self-describe" free text
      g('Age'),                    // Age
      g('Council Area'),           // Council Area
      g('Circumstances'),          // Circumstances
      g('Circumstances Other'),    // Circumstances Other
      g('Feelings'),               // Feelings
      g('Environments'),           // Environments
      g('Energy Sustainability'),  // Energy Sustainability
      g('Energy Drain Tasks'),     // Energy Drain Tasks
      g('Joy'),                    // Joy
      g('Support Access'),         // Support Access
      g('Functioning Tools'),      // Functioning Tools
      g('Help'),                   // Help (multi-select joined with "; ")
      g('Help Other'),             // Help Other
      g('Working Well Services')   // Working Well Services
    ];

    sheet.appendRow(row);
    return ok('submitted');

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── VAN GPS TRACKER (GET) ───────────────────────────────────────────────
// Driver sends: ?update=true&lat=54.84&lon=-1.47
// Public reads: (no params) → returns {lat, lon, timestamp, stale}
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // WRITE PATH — driver broadcasting position
    if (e.parameter.update === 'true') {
      var lat = parseFloat(e.parameter.lat);
      var lon = parseFloat(e.parameter.lon);
      if (isNaN(lat) || isNaN(lon)) return errOut('Invalid coordinates');

      // Human-readable UK timestamp: "18/05/2026 19:17:04"
      var now = new Date();
      var ts  = Utilities.formatDate(now, 'Europe/London', 'dd/MM/yyyy HH:mm:ss');

      var vs = getOrCreateVanSheet(ss);
      vs.appendRow([ts, lat, lon]);   // append — keeps full history log

      return ok('location_saved');
    }

    // READ PATH — public users fetching current van position (always latest row)
    var vs = ss.getSheetByName(VAN_SHEET);
    if (!vs || vs.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'no_data' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var lastRow = vs.getLastRow();
    var data    = vs.getRange(lastRow, 1, 1, 3).getValues()[0];

    return ContentService
      .createTextOutput(JSON.stringify({
        lat:       data[1],
        lon:       data[2],
        timestamp: data[0]   // already a readable string
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── HELPERS ─────────────────────────────────────────────────────────────
function ok(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

function errOut(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'error', message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateVanSheet(ss) {
  var sheet = ss.getSheetByName(VAN_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(VAN_SHEET);
    sheet.appendRow(['Timestamp', 'Lat', 'Lon']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
