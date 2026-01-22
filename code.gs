/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v3.3 (PERSONAL)
 * -----------------------------------------------------------------------
 * 1. Simpan kod ini di Google Sheets (Extensions > Apps Script).
 * 2. Deploy sebagai Web App.
 * 3. Execute as: ME.
 * 4. Who has access: ANYONE.
 */

const SHEET_BACKUP = "DB_BACKUP";

/**
 * FUNGSI GET: Digunakan untuk tarik data dari Sheets ke App.
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_BACKUP);
    
    // Jika sheet backup belum ada, beritahu App untuk buat 'initial save'
    if (!sheet || sheet.getRange(1, 1).getValue() === "") {
      return createJsonResponse({ 
        status: "EMPTY", 
        message: "Sheet sedia, tetapi belum ada data. Sila klik 'Simpan' di dalam App dahulu." 
      });
    }
    
    var data = sheet.getRange(1, 1).getValue();
    return ContentService.createTextOutput(data)
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return createJsonResponse({ status: "ERROR", message: err.message });
  }
}

/**
 * FUNGSI POST: Digunakan untuk hantar data dari App ke Sheets.
 */
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Simpan Data JSON Penuh (Master Backup)
    var backupSheet = ss.getSheetByName(SHEET_BACKUP) || ss.insertSheet(SHEET_BACKUP);
    backupSheet.clear();
    backupSheet.getRange(1, 1).setValue(JSON.stringify(contents));
    backupSheet.getRange(1, 2).setValue("Last Sync: " + new Date().toLocaleString());
    backupSheet.getRange(1, 2).setFontWeight("bold");

    // 2. Kemaskini Tab-Tab Visual (Human Readable)
    
    // TAB: DATA AHLI
    updateSheet(ss, 'DATA_AHLI', ['ID', 'Nama', 'No KP', 'Tingkatan', 'Kelas', 'Jantina', 'Kaum'], (contents.students || []).map(s => [
      s.id, s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum
    ]));
    
    // TAB: DATA GURU
    updateSheet(ss, 'DATA_GURU', ['ID', 'Nama', 'Jawatan', 'Telefon'], (contents.teachers || []).map(t => [
      t.id, t.nama, t.jawatan, t.telefon
    ]));

    // TAB: DATA AKTIVITI
    updateSheet(ss, 'DATA_AKTIVITI', ['Tarikh', 'Masa', 'Aktiviti', 'Tempat', 'Ulasan'], (contents.activities || []).map(a => [
      a.tarikh, a.masa, a.nama, a.tempat, a.ulasan
    ]));

    // TAB: STRUKTUR ORGANISASI
    var ajkRows = (contents.committees || []).map(c => {
      var student = (contents.students || []).find(s => s.id === c.studentId);
      return [c.jawatan, student ? student.nama : 'N/A', student ? student.tingkatan : '-', student ? student.kelas : '-'];
    });
    updateSheet(ss, 'STRUKTUR_ORGANISASI', ['Jawatan', 'Nama Ahli', 'Tingkatan', 'Kelas'], ajkRows);

    // TAB: LOG KEHADIRAN
    var attRows = (contents.attendances || []).map(a => [
      a.tarikh, a.presents ? a.presents.length : 0, contents.students ? contents.students.length : 0
    ]);
    updateSheet(ss, 'LOG_KEHADIRAN', ['Tarikh', 'Bil Hadir', 'Jumlah Ahli'], attRows);

    return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * UTILITY: Fungsi untuk kemaskini helaian secara sistematik.
 */
function updateSheet(ss, sheetName, headers, rows) {
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  sheet.clear();
  
  // Design Header
  sheet.getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#dc2626') // Warna Merah Bomba
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
    
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    sheet.getRange(2, 1, rows.length, headers.length).setVerticalAlignment('middle');
  }
  
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  sheet.setRowHeight(1, 30);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}