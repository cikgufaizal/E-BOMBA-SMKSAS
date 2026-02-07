/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD CORE v15.0
 * KEMASKINI: 7 FEB (FIXED FETCH FAILURE)
 * Sila pastikan: Deploy -> New Deployment -> Web App -> Execute as: Me -> Who has access: Anyone.
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Baca data dari tab-tab manual
    var teachers = getSheetData(ss, "DATA_GURU", ["id", "nama", "jawatan", "telefon"]);
    var students = getSheetData(ss, "DATA_AHLI", ["id", "nama", "noKP", "tingkatan", "kelas", "jantina", "kaum"]);
    var activities = getSheetData(ss, "DATA_AKTIVITI", ["tarikh", "masa", "nama", "tempat", "ulasan"]);
    var committees = getSheetData(ss, "STRUKTUR_ORGANISASI", ["jawatan", "nama", "tingkatan", "kelas"]);
    var annualPlans = getSheetData(ss, "RANCANGAN_TAHUNAN", ["bulan", "program", "tempat", "catatan"]);
    
    // Backup Fallback
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
    // Sokongan untuk data yang dihantar sebagai JSON string (text/plain)
    var jsonString = e.postData.contents;
    var payload = JSON.parse(jsonString);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Simpan backup penuh
    var backupSheet = ss.getSheetByName("DB_BACKUP") || ss.insertSheet("DB_BACKUP");
    backupSheet.getRange(1, 1).setValue(jsonString);
    backupSheet.getRange(1, 2).setValue("Updated: " + new Date().toLocaleString());
    
    // 2. Kemaskini tab-tab manual
    if (payload.teachers) updateSheetFromData(ss, "DATA_GURU", payload.teachers, ["id", "nama", "jawatan", "telefon"]);
    if (payload.students) updateSheetFromData(ss, "DATA_AHLI", payload.students, ["id", "nama", "noKP", "tingkatan", "kelas", "jantina", "kaum"]);
    if (payload.activities) updateSheetFromData(ss, "DATA_AKTIVITI", payload.activities, ["tarikh", "masa", "nama", "tempat", "ulasan"]);
    if (payload.annualPlans) updateSheetFromData(ss, "RANCANGAN_TAHUNAN", payload.annualPlans, ["bulan", "program", "tempat", "catatan"]);

    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

// --- HELPERS ---

function getSheetData(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var range = sheet.getDataRange();
  if (range.getLastRow() <= 1) return [];
  var values = range.getValues();
  
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
  if (!data || data.length === 0) return;
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  // Padam data lama kecuali header
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  
  // Pastikan header wujud
  if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === "") {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers.map(function(h){ return h.toUpperCase(); })])
         .setBackground("#ef4444").setFontColor("white").setFontWeight("bold");
  }
  
  // Masukkan data baru
  var rows = data.map(function(item) {
    return headers.map(function(h) { return item[h] || ""; });
  });
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}