/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD CORE v17.0 (ULTRA-STABLE CHUNKING)
 * KEMASKINI: 9 FEB (FIXED DATA TRUNCATION ISSUE)
 * 
 * Sila pastikan selepas kemas kini: 
 * 1. Klik 'Deploy' -> 'New Deployment'.
 * 2. Pilih 'Web App'.
 * 3. Execute as: 'Me'.
 * 4. Who has access: 'Anyone'.
 */

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var backupSheet = ss.getSheetByName("DB_BACKUP") || ss.insertSheet("DB_BACKUP");
    
    // 1. Ambil semua data dari baris-baris backup dan cantumkan semula (De-chunking)
    var rows = backupSheet.getDataRange().getValues();
    var fullJson = "";
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0]) fullJson += rows[i][0].toString();
    }

    var backupData = {};
    if (fullJson && fullJson.startsWith("{")) {
      try {
        backupData = JSON.parse(fullJson);
      } catch (e) {
        console.error("JSON Parse Error in Backup:", e);
      }
    }

    // 2. Ambil data dari tab manual untuk rujukan manusia (Syncing)
    var teachers = getSheetData(ss, "DATA_GURU", ["id", "nama", "noKP", "jawatan", "telefon"]);
    var students = getSheetData(ss, "DATA_AHLI", ["id", "nama", "noKP", "tingkatan", "kelas", "jantina", "kaum", "noKeahlian", "telefonWaris"]);
    var activities = getSheetData(ss, "DATA_AKTIVITI", ["id", "tarikh", "masa", "nama", "tempat", "ulasan", "photos"]);
    
    // 3. Merge Logic: Pastikan apa yang ada di tab manual selari dengan backup data kompleks
    var finalData = {
      settings: backupData.settings || {},
      teachers: teachers.length > 0 ? teachers : (backupData.teachers || []),
      students: students.length > 0 ? mergeStudentData(students, backupData.students) : (backupData.students || []),
      activities: activities.length > 0 ? mergeActivityData(activities, backupData.activities) : (backupData.activities || []),
      committees: backupData.committees || [],
      annualPlans: backupData.annualPlans || [],
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
    
    // 1. Simpan dalam mod CHUNKED (Pecahkan string kepada 45,000 aksara setiap baris)
    // Had Google Sheets ialah 50,000 aksara per-sel. Kita guna 45,000 untuk keselamatan.
    var backupSheet = ss.getSheetByName("DB_BACKUP") || ss.insertSheet("DB_BACKUP");
    backupSheet.clear();
    
    var chunkSize = 45000;
    var chunks = [];
    for (var i = 0; i < jsonString.length; i += chunkSize) {
      chunks.push([jsonString.substring(i, i + chunkSize)]);
    }
    
    // Tulis ke sheet (Setiap chunk satu baris)
    if (chunks.length > 0) {
      backupSheet.getRange(1, 1, chunks.length, 1).setValues(chunks);
    }
    
    // 2. Kemaskini tab rujukan manusia (Human Readable Tabs)
    if (payload.teachers) updateSheetFromData(ss, "DATA_GURU", payload.teachers, ["id", "nama", "noKP", "jawatan", "telefon"]);
    if (payload.students) updateSheetFromData(ss, "DATA_AHLI", payload.students, ["id", "nama", "noKP", "tingkatan", "kelas", "jantina", "kaum", "noKeahlian", "telefonWaris"]);
    if (payload.activities) updateSheetFromData(ss, "DATA_AKTIVITI", payload.activities, ["id", "tarikh", "masa", "nama", "tempat", "ulasan", "photos"]);

    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

// --- LOGIK GABUNGAN (PENTING UNTUK KESTABILAN DATA) ---

function mergeStudentData(sheetStudents, backupStudents) {
  if (!backupStudents) return sheetStudents;
  return sheetStudents.map(function(s) {
    var b = backupStudents.find(function(x) { return x.id === s.id });
    if (b) {
      s.health = b.health;
      s.alamat = b.alamat;
      s.namaWaris = b.namaWaris;
      s.noKPWaris = b.noKPWaris;
      s.telefonWaris = b.telefonWaris;
    }
    return s;
  });
}

function mergeActivityData(sheetActs, backupActs) {
  if (!backupActs) return sheetActs;
  return sheetActs.map(function(a) {
    var b = backupActs.find(function(x) { return x.id === a.id });
    if (b) {
      // Jika lajur 'photos' di sheet kosong atau rosak, tarik dari JSON backup
      if (!a.photos || a.photos === "" || a.photos === "[]") {
        a.photos = b.photos;
      } else if (typeof a.photos === 'string' && a.photos.startsWith("[")) {
        try { a.photos = JSON.parse(a.photos); } catch(e) {}
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
      // Jika data adalah array (imej), hadkan simpanan di tab rujukan jika terlalu besar
      if (Array.isArray(val)) {
        var str = JSON.stringify(val);
        return str.length > 40000 ? "[IMEJ BESAR - LIHAT DALAM APP]" : str;
      }
      return val || ""; 
    });
  });
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}