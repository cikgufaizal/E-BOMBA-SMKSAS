/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD CORE v14.0 (FIXED)
 * Pastikan Deploy: New Deployment -> Web App -> Me -> Anyone.
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Tarik data dari tab manual (Mapping ikut screenshot anda)
    var teachers = getSheetData(ss, "DATA_GURU", ["id", "nama", "jawatan", "telefon"]);
    var students = getSheetData(ss, "DATA_AHLI", ["id", "nama", "noKP", "tingkatan", "kelas", "jantina", "kaum"]);
    var activities = getSheetData(ss, "DATA_AKTIVITI", ["tarikh", "masa", "nama", "tempat", "ulasan"]);
    var committees = getSheetData(ss, "STRUKTUR_ORGANISASI", ["jawatan", "nama", "tingkatan", "kelas"]);
    var annualPlans = getSheetData(ss, "RANCANGAN_TAHUNAN", ["bulan", "program", "tempat", "catatan"]);
    
    // Ambil data backup sebagai fallback
    var backupData = null;
    var backupSheet = ss.getSheetByName("DB_BACKUP");
    if (backupSheet) {
      var val = backupSheet.getRange(1, 1).getValue();
      if (val && val.toString().startsWith("{")) {
        backupData = JSON.parse(val);
      }
    }

    var finalData = {
      teachers: teachers.length > 0 ? teachers : (backupData ? backupData.teachers : []),
      students: students.length > 0 ? students : (backupData ? backupData.students : []),
      activities: activities.length > 0 ? activities : (backupData ? backupData.activities : []),
      committees: committees.length > 0 ? committees : (backupData ? backupData.committees : []),
      annualPlans: annualPlans.length > 0 ? annualPlans : (backupData ? backupData.annualPlans : []),
      attendances: backupData ? backupData.attendances : [],
      lastUpdated: new Date().getTime()
    };

    return ContentService.createTextOutput(JSON.stringify(finalData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "ERROR", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // SIMPAN BACKUP JSON
    var backupSheet = ss.getSheetByName("DB_BACKUP") || ss.insertSheet("DB_BACKUP");
    backupSheet.getRange(1, 1).setValue(e.postData.contents);
    backupSheet.getRange(1, 2).setValue("Last Sync: " + new Date().toLocaleString());
    
    // KEMASKINI TAB MANUAL (Guna clearContents untuk kekalkan warna header)
    updateSheetFromData(ss, "DATA_GURU", payload.teachers, ["id", "nama", "jawatan", "telefon"]);
    updateSheetFromData(ss, "DATA_AHLI", payload.students, ["id", "nama", "noKP", "tingkatan", "kelas", "jantina", "kaum"]);
    updateSheetFromData(ss, "DATA_AKTIVITI", payload.activities, ["tarikh", "masa", "nama", "tempat", "ulasan"]);
    updateSheetFromData(ss, "RANCANGAN_TAHUNAN", payload.annualPlans, ["bulan", "program", "tempat", "catatan"]);

    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

function getSheetData(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  var results = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    var hasData = false;
    headers.forEach(function(h, idx) {
      var val = values[i][idx];
      if (val !== undefined && val !== "") hasData = true;
      if (h === "id" && (!val || val === "")) val = "id-" + (i + 100); 
      obj[h] = val;
    });
    if (hasData) results.push(obj);
  }
  return results;
}

function updateSheetFromData(ss, sheetName, data, headers) {
  if (!data) return;
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  // Hanya padam isi, bukan format (warna merah header akan kekal)
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).clearContent();
  }
  
  // Tulis Header jika kosong
  if (sheet.getRange(1, 1).getValue() === "") {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers.map(h => h.toUpperCase())])
         .setFontWeight("bold").setBackground("#ef4444").setFontColor("white");
  }
  
  if (data.length > 0) {
    var rows = data.map(function(item) {
      return headers.map(function(h) { return item[h] || ""; });
    });
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}