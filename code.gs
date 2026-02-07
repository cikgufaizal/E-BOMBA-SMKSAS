/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD CORE v11.0 (LIVE ONLY)
 */

const SYNC_SHEET = "DATABASE_SYNC";

/**
 * Mengendalikan permintaan GET (Ambil Data)
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
  
  var dataRaw = sheet.getRange(1, 1).getValue();
  
  // Jika sel kosong, pulangkan struktur data asas
  if (!dataRaw || dataRaw.toString().trim() === "" || dataRaw.toString().trim() === "null") {
    return createJsonResponse({ 
      status: "NEW_SESSION", 
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
    return ContentService.createTextOutput(dataRaw.toString())
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return createJsonResponse({ status: "ERROR", message: err.toString() });
  }
}

/**
 * Mengendalikan permintaan POST (Simpan Data)
 */
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput("FAILED: NO_DATA");
    }
    
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var syncSheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
    
    // 1. Simpan Blob JSON Utama di sel A1 (Jantung Sistem)
    syncSheet.getRange(1, 1).setValue(e.postData.contents);
    
    // 2. Kemaskini Tab Visual (Pilihan: Untuk rujukan manusia di Google Sheets)
    if (contents.students) {
      updateVisualSheet(ss, 'DATA_AHLI', ['NAMA', 'NO KP', 'TING.', 'KELAS'], 
        contents.students.map(s => [s.nama, s.noKP, s.tingkatan, s.kelas]));
    }
    
    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

function updateVisualSheet(ss, name, headers, rows) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#b91c1c').setFontColor('white').setFontWeight('bold');
  
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}