
/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v3.2
 * -----------------------------------------------------------
 * PUSH (doPost) & PULL (doGet)
 */

const SHEET_BACKUP = "DB_BACKUP";

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_BACKUP);
    if (!sheet) return createJsonResponse({ error: "No data" });
    var data = sheet.getRange(1, 1).getValue();
    return ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return createJsonResponse({ error: err.message });
  }
}

function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Full JSON Backup
    var backupSheet = ss.getSheetByName(SHEET_BACKUP) || ss.insertSheet(SHEET_BACKUP);
    backupSheet.getRange(1, 1).setValue(JSON.stringify(contents));
    backupSheet.getRange(1, 2).setValue("Last Sync: " + new Date().toLocaleString());

    // 2. Tab Data Ahli
    updateSheet(ss, 'DATA_AHLI', ['ID', 'Nama', 'No KP', 'Tingkatan', 'Kelas', 'Jantina', 'Kaum'], (contents.students || []).map(s => [
      s.id, s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum
    ]));
    
    // 3. Tab Guru
    updateSheet(ss, 'DATA_GURU', ['ID', 'Nama', 'Jawatan', 'Telefon'], (contents.teachers || []).map(t => [
      t.id, t.nama, t.jawatan, t.telefon
    ]));

    // 4. Tab Aktiviti
    updateSheet(ss, 'DATA_AKTIVITI', ['Tarikh', 'Masa', 'Aktiviti', 'Tempat', 'Ulasan'], (contents.activities || []).map(a => [
      a.tarikh, a.masa, a.nama, a.tempat, a.ulasan
    ]));

    // 5. Tab Rancangan Tahunan
    updateSheet(ss, 'RANCANGAN_TAHUNAN', ['Bulan', 'Program', 'Tempat', 'Catatan'], (contents.annualPlans || []).map(p => [
      p.bulan, p.program, p.tempat, p.catatan
    ]));

    // 6. Tab AJK
    var ajkRows = (contents.committees || []).map(c => {
      var student = (contents.students || []).find(s => s.id === c.studentId);
      return [c.jawatan, student ? student.nama : 'N/A', student ? student.tingkatan : '-', student ? student.kelas : '-'];
    });
    updateSheet(ss, 'STRUKTUR_ORGANISASI', ['Jawatan', 'Nama Ahli', 'Tingkatan', 'Kelas'], ajkRows);

    // 7. Tab Kehadiran
    var attRows = (contents.attendances || []).map(a => [
      a.tarikh, a.presents ? a.presents.length : 0, contents.students ? contents.students.length : 0
    ]);
    updateSheet(ss, 'LOG_KEHADIRAN', ['Tarikh', 'Bil Hadir', 'Jumlah Ahli'], attRows);

    return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

function updateSheet(ss, sheetName, headers, rows) {
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#b91c1c').setFontColor('#ffffff').setHorizontalAlignment('center');
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
