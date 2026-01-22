
/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v9.0
 * -----------------------------------------------------------------------------
 * SISTEM INI AKAN MENYUSUN DATA KE DALAM BARIS-BARIS SPREADSHEET (ROWS).
 */

const SYNC_SHEET = "SYSTEM_SYNC_STATE";

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SYNC_SHEET);
  if (!sheet) return createJsonResponse({ status: "EMPTY", lastUpdated: 0 });
  
  var data = sheet.getRange(1, 1).getValue();
  if (!data) return createJsonResponse({ status: "EMPTY", lastUpdated: 0 });
  
  return ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) return ContentService.createTextOutput("FAILED: NO_DATA");
    var contents = JSON.parse(e.postData.contents);
    
    // Handshake Test
    if (contents.test) return ContentService.createTextOutput("CONNECTED");

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var syncSheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
    
    // 1. BANDINGKAN TIMESTAMP (ELAK OVERWRITE)
    var oldDataRaw = syncSheet.getRange(1, 1).getValue();
    if (oldDataRaw) {
      var oldData = JSON.parse(oldDataRaw);
      if (contents.lastUpdated && oldData.lastUpdated && contents.lastUpdated < oldData.lastUpdated) {
        return ContentService.createTextOutput("FAILED: OLDER_VERSION_DETECTED");
      }
    }

    // 2. SIMPAN STATE UTAMA (UNTUK APP TARIK)
    syncSheet.clear().getRange(1, 1).setValue(e.postData.contents);
    
    // 3. SUSUN DATA KE DALAM BARIS (UNTUK CIKGU TENGOK/PRINT DI GOOGLE SHEETS)
    if (contents.students) {
      updateRows(ss, 'AHLI', ['ID', 'NAMA', 'NO KP', 'TING.', 'KELAS', 'JANTINA', 'KAUM'], 
        contents.students.map(s => [s.id, s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum]));
    }
    
    if (contents.teachers) {
      updateRows(ss, 'GURU', ['ID', 'NAMA', 'JAWATAN', 'TELEFON'], 
        contents.teachers.map(t => [t.id, t.nama, t.jawatan, t.telefon]));
    }
    
    if (contents.activities) {
      updateRows(ss, 'AKTIVITI', ['ID', 'TARIKH', 'NAMA', 'TEMPAT', 'MASA', 'ULASAN'], 
        contents.activities.map(a => [a.id, a.tarikh, a.nama, a.tempat, a.masa, a.ulasan]));
    }

    if (contents.attendances) {
      updateRows(ss, 'KEHADIRAN', ['ID', 'TARIKH', 'JUMLAH HADIR'], 
        contents.attendances.map(att => [att.id, att.tarikh, att.presents.length]));
    }

    if (contents.annualPlans) {
      updateRows(ss, 'RANCANGAN_TAHUNAN', ['ID', 'BULAN', 'PROGRAM', 'TEMPAT', 'CATATAN'], 
        contents.annualPlans.map(p => [p.id, p.bulan, p.program, p.tempat, p.catatan]));
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
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
