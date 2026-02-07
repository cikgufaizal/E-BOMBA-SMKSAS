/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD CORE v10.8
 * -----------------------------------------------------------------------------
 * Folder ID Rujukan (Untuk kegunaan masa hadapan):
 * Images: 1U2scG4tzvTSNGQrqg00zpam4kUQUxDiy
 * Main: 1zl7ObhbrN_ZOLSfid8WSylWzzbpa8srL
 * -----------------------------------------------------------------------------
 * ARAHAN PENTING:
 * 1. Deploy as Web App
 * 2. Execute as: Me (E-mel anda)
 * 3. Who has access: Anyone (Wajib pilih 'Anyone' untuk bypass isu login di peranti lain)
 */

const SYNC_SHEET = "DATABASE_SYNC";

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
  
  var dataRaw = sheet.getRange(1, 1).getValue();
  
  // Jika sel kosong, pulangkan struktur data asas yang sah
  if (!dataRaw || dataRaw.toString().trim() === "") {
    return createJsonResponse({ 
      status: "EMPTY", 
      lastUpdated: 0, 
      students: [], 
      teachers: [], 
      committees: [], 
      attendances: [], 
      activities: [], 
      annualPlans: [] 
    });
  }
  
  try {
    // Pulangkan data JSON yang disimpan dalam format JSON murni
    return ContentService.createTextOutput(dataRaw.toString())
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return createJsonResponse({ status: "ERROR", message: err.toString() });
  }
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput("FAILED: NO_DATA");
    }
    
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var syncSheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
    
    // 1. Simpan JSON Utama di sel A1 (Source of Truth)
    syncSheet.getRange(1, 1).setValue(e.postData.contents);
    
    // 2. Kemaskini Tab Visual (Optional: Supaya anda boleh lihat data di Sheets)
    if (contents.students) {
      updateRows(ss, 'SENARAI_AHLI', ['ID', 'NAMA', 'NO KP', 'TING.', 'KELAS', 'NO AHLI', 'KAUM'], 
        contents.students.map(s => [s.id, s.nama, s.noKP, s.tingkatan, s.kelas, s.noKeahlian || '-', s.kaum]));
    }
    
    if (contents.activities) {
      updateRows(ss, 'LOG_AKTIVITI', ['ID', 'TARIKH', 'NAMA', 'TEMPAT', 'MASA', 'ULASAN'], 
        contents.activities.map(a => [a.id, a.tarikh, a.nama, a.tempat, a.masa, a.ulasan]));
    }

    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

function updateRows(ss, name, headers, rows) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#b91c1c').setFontColor('white').setFontWeight('bold');
  
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows).setBorder(true, true, true, true, true, true);
  }
  sheet.autoResizeColumns(1, headers.length);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}