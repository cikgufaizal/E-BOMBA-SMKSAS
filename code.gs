/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD CORE v16.0
 * KEMASKINI: 8 FEB (FIXED IMAGE & LOGO PERSISTENCE)
 * Sila pastikan: Deploy -> New Deployment -> Web App -> Execute as: Me -> Who has access: Anyone.
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Ambil Backup Penuh dahulu (Source of Truth untuk data kompleks/Base64)
    var backupData = {};
    var backupSheet = ss.getSheetByName("DB_BACKUP");
    if (backupSheet) {
      var val = backupSheet.getRange(1, 1).getValue();
      if (val && val.toString().startsWith("{")) {
        backupData = JSON.parse(val);
      }
    }

    // 2. Baca data dari tab-tab manual (Untuk paparan manusia di Sheets)
    // Jika data di tab wujud, ia akan "override" backup untuk memastikan apa yang user taip di Sheet masuk ke App
    var teachers = getSheetData(ss, "DATA_GURU", ["id", "nama", "noKP", "jawatan", "telefon"]);
    var students = getSheetData(ss, "DATA_AHLI", ["id", "nama", "noKP", "tingkatan", "kelas", "jantina", "kaum", "noKeahlian", "telefonWaris"]);
    var activities = getSheetData(ss, "DATA_AKTIVITI", ["id", "tarikh", "masa", "nama", "tempat", "ulasan", "photos"]);
    var committees = getSheetData(ss, "STRUKTUR_ORGANISASI", ["id", "studentId", "jawatan"]);
    var annualPlans = getSheetData(ss, "RANCANGAN_TAHUNAN", ["id", "bulan", "program", "tempat", "catatan"]);
    
    // 3. Gabungkan data (Merge logic)
    var finalData = {
      settings: backupData.settings || {},
      teachers: teachers.length > 0 ? teachers : (backupData.teachers || []),
      students: students.length > 0 ? mergeStudentData(students, backupData.students) : (backupData.students || []),
      activities: activities.length > 0 ? mergeActivityData(activities, backupData.activities) : (backupData.activities || []),
      committees: committees.length > 0 ? committees : (backupData.committees || []),
      annualPlans: annualPlans.length > 0 ? annualPlans : (backupData.annualPlans || []),
      attendances: backupData.attendances || [],
      lastUpdated: backupData.lastUpdated || new Date().getTime()
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
    var jsonString = e.postData.contents;
    var payload = JSON.parse(jsonString);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Simpan backup penuh (PENTING: Ini menyimpan Base64 Logos & Photos)
    var backupSheet = ss.getSheetByName("DB_BACKUP") || ss.insertSheet("DB_BACKUP");
    backupSheet.clear(); 
    backupSheet.getRange(1, 1).setValue(jsonString);
    backupSheet.getRange(1, 2).setValue("Last Updated: " + new Date().toLocaleString());
    
    // 2. Kemaskini tab-tab manual untuk rujukan manusia
    if (payload.teachers) updateSheetFromData(ss, "DATA_GURU", payload.teachers, ["id", "nama", "noKP", "jawatan", "telefon"]);
    if (payload.students) updateSheetFromData(ss, "DATA_AHLI", payload.students, ["id", "nama", "noKP", "tingkatan", "kelas", "jantina", "kaum", "noKeahlian", "telefonWaris"]);
    if (payload.activities) updateSheetFromData(ss, "DATA_AKTIVITI", payload.activities, ["id", "tarikh", "masa", "nama", "tempat", "ulasan", "photos"]);
    if (payload.annualPlans) updateSheetFromData(ss, "RANCANGAN_TAHUNAN", payload.annualPlans, ["id", "bulan", "program", "tempat", "catatan"]);
    if (payload.committees) updateSheetFromData(ss, "STRUKTUR_ORGANISASI", payload.committees, ["id", "studentId", "jawatan"]);

    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

// --- LOGIK GABUNGAN (PENTING UNTUK GAMBAR) ---

function mergeStudentData(sheetStudents, backupStudents) {
  if (!backupStudents) return sheetStudents;
  return sheetStudents.map(function(s) {
    var b = backupStudents.find(function(x) { return x.id === s.id });
    if (b) {
      // Kekalkan data kompleks (Health & Alamat) yang tak masuk dalam Columns Sheet
      s.health = b.health;
      s.alamat = b.alamat;
      s.namaWaris = b.namaWaris;
      s.noKPWaris = b.noKPWaris;
    }
    return s;
  });
}

function mergeActivityData(sheetActs, backupActs) {
  if (!backupActs) return sheetActs;
  return sheetActs.map(function(a) {
    var b = backupActs.find(function(x) { return x.id === a.id });
    if (b) {
      // Jika lajur 'photos' di sheet kosong (sebab limit character Sheets), ambil dari backup JSON
      if (!a.photos || a.photos === "" || a.photos === "[]") {
        a.photos = b.photos;
      } else if (typeof a.photos === 'string' && a.photos.startsWith("[")) {
        a.photos = JSON.parse(a.photos);
      }
    }
    return a;
  });
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
      obj[h] = val;
    });
    if (hasData) results.push(obj);
  }
  return results;
}

function updateSheetFromData(ss, sheetName, data, headers) {
  if (!data) return;
  var sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
  
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers.map(function(h){ return h.toUpperCase(); })])
       .setBackground("#ef4444").setFontColor("white").setFontWeight("bold");
  
  if (data.length === 0) return;

  var rows = data.map(function(item) {
    return headers.map(function(h) { 
      var val = item[h];
      // Tukar array (photos) kepada string untuk simpan dalam sel
      if (Array.isArray(val)) return JSON.stringify(val);
      return val || ""; 
    });
  });
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}