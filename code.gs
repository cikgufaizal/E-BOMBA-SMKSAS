
/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v7.5
 * -----------------------------------------------------------------------------
 * UPDATED: Menambah sokongan lastUpdated timestamp.
 */

const DB_SHEET = "RAW_DATABASE";

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(DB_SHEET);
    if (!sheet) return createJsonResponse({ status: "EMPTY" });
    var data = sheet.getRange(1, 1).getValue();
    if (!data) return createJsonResponse({ status: "EMPTY" });
    return ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return createJsonResponse({ status: "ERROR", message: err.toString() });
  }
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) return ContentService.createTextOutput("NO_DATA");
    var contents = JSON.parse(e.postData.contents);
    
    // FUNGSI KHAS UNTUK BUTANG UJI SAMBUNGAN
    if (contents.test) {
      return ContentService.createTextOutput("CONNECTED");
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dbSheet = ss.getSheetByName(DB_SHEET) || ss.insertSheet(DB_SHEET);
    
    // Simpan semua data JSON ke cell A1
    dbSheet.clear().getRange(1, 1).setValue(e.postData.contents);
    
    // Kemaskini Tab Visual untuk Guru & Ahli supaya cikgu nampak data live di sheet
    if (contents.students) updateSheet(ss, 'AHLI', ['NAMA', 'NO KP', 'TING.', 'KELAS', 'JANTINA', 'KAUM'], contents.students.map(s => [s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum]));
    if (contents.teachers) updateSheet(ss, 'GURU', ['NAMA', 'JAWATAN', 'TEL'], contents.teachers.map(t => [t.nama, t.jawatan, t.telefon]));

    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

function updateSheet(ss, name, headers, rows) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground('#b91c1c').setFontColor('white').setFontWeight('bold');
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows).setBorder(true, true, true, true, true, true);
  }
  sheet.autoResizeColumns(1, headers.length);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
