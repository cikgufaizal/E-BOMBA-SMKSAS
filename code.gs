/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v8.0
 * -----------------------------------------------------------------------------
 * AMARAN: Jangan ubah kod ini melainkan anda tahu apa yang anda buat.
 */

const DB_SHEET = "RAW_DATABASE";

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(DB_SHEET);
  
  if (!sheet) {
    return createJsonResponse({ status: "EMPTY", lastUpdated: 0 });
  }
  
  var data = sheet.getRange(1, 1).getValue();
  if (!data || data === "") {
    return createJsonResponse({ status: "EMPTY", lastUpdated: 0 });
  }
  
  // Kembalikan data JSON terus ke Web App
  return ContentService.createTextOutput(data)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput("FAILED: NO_DATA");
    }
    
    var contents = JSON.parse(e.postData.contents);
    
    // Fungsi Uji Sambungan (Handshake)
    if (contents.test) {
      return ContentService.createTextOutput("CONNECTED");
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dbSheet = ss.getSheetByName(DB_SHEET) || ss.insertSheet(DB_SHEET);
    
    // Ambil data lama di Cloud (untuk bandingkan timestamp jika perlu)
    var oldDataRaw = dbSheet.getRange(1, 1).getValue();
    if (oldDataRaw && oldDataRaw !== "") {
      var oldData = JSON.parse(oldDataRaw);
      // Jika data yang nak masuk ni LAGI LAMA (timestamp kecil) dari data sedia ada, TOLAK.
      if (contents.lastUpdated && oldData.lastUpdated && contents.lastUpdated < oldData.lastUpdated) {
        return ContentService.createTextOutput("FAILED: OLDER_VERSION_DETECTED");
      }
    }

    // SIMPAN DATA UTAMA
    dbSheet.clear().getRange(1, 1).setValue(e.postData.contents);
    
    // KEMASKINI VISUAL (Untuk cikgu tengok kat Google Sheets terus)
    if (contents.students) updateSheet(ss, 'AHLI', ['NAMA', 'NO KP', 'TING.', 'KELAS', 'JANTINA', 'KAUM'], contents.students.map(s => [s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum]));
    if (contents.teachers) updateSheet(ss, 'GURU', ['NAMA', 'JAWATAN', 'TEL'], contents.teachers.map(t => [t.nama, t.jawatan, t.telefon]));
    if (contents.activities) updateSheet(ss, 'AKTIVITI', ['TARIKH', 'NAMA', 'TEMPAT', 'MASA'], contents.activities.map(a => [a.tarikh, a.nama, a.tempat, a.masa]));

    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

function updateSheet(ss, name, headers, rows) {
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