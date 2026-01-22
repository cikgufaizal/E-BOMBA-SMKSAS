/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v6.0
 * -----------------------------------------------------------------------------
 * Menyokong Penyelarasan Penuh & Visualisasi Data Automatik
 */

const DB_SHEET = "RAW_DATABASE";

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(DB_SHEET);
    
    if (!sheet) {
      return createJsonResponse({ status: "EMPTY", message: "Database belum diwujudkan." });
    }
    
    var data = sheet.getRange(1, 1).getValue();
    if (!data || data === "") return createJsonResponse({ status: "EMPTY", message: "Tiada data." });

    return ContentService.createTextOutput(data)
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return createJsonResponse({ status: "ERROR", message: err.toString() });
  }
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) return ContentService.createTextOutput("NO_DATA");

    var postData = e.postData.contents;
    var contents = JSON.parse(postData);
    
    // Test connection pulse
    if (contents.test) return ContentService.createTextOutput("CONNECTED");

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Simpan Data Mentah (JSON Sync)
    var dbSheet = ss.getSheetByName(DB_SHEET) || ss.insertSheet(DB_SHEET);
    dbSheet.clear();
    dbSheet.getRange(1, 1).setValue(postData);
    dbSheet.getRange(1, 2).setValue("Kemaskini Terakhir: " + new Date().toLocaleString());

    // 2. Tab Visual: AHLI
    if (contents.students) {
      updateSheet(ss, 'AHLI', ['NAMA', 'NO KP', 'TINGKATAN', 'KELAS', 'JANTINA', 'KAUM'], contents.students.map(s => [
        s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum
      ]));
    }

    // 3. Tab Visual: GURU
    if (contents.teachers) {
      updateSheet(ss, 'GURU', ['NAMA', 'JAWATAN', 'TELEFON'], contents.teachers.map(t => [
        t.nama, t.jawatan, t.telefon
      ]));
    }

    // 4. Tab Visual: AJK (Struktur Organisasi)
    if (contents.committees && contents.students) {
      var ajkRows = contents.committees.map(ajk => {
        var student = contents.students.find(s => s.id === ajk.studentId);
        return [ajk.jawatan, student ? student.nama : 'N/A', student ? student.tingkatan + " " + student.kelas : 'N/A'];
      });
      updateSheet(ss, 'CARTA_ORGANISASI', ['JAWATAN', 'NAMA PENUH', 'TINGKATAN/KELAS'], ajkRows);
    }

    // 5. Tab Visual: AKTIVITI (Log)
    if (contents.activities) {
      updateSheet(ss, 'LOG_AKTIVITI', ['TARIKH', 'MASA', 'NAMA AKTIVITI', 'TEMPAT', 'ULASAN'], contents.activities.map(a => [
        a.tarikh, a.masa, a.nama, a.tempat, a.ulasan
      ]));
    }

    // 6. Tab Visual: RANCANGAN_TAHUNAN
    if (contents.annualPlans) {
      updateSheet(ss, 'RANCANGAN_TAHUNAN', ['BULAN', 'PROGRAM', 'TEMPAT', 'CATATAN'], contents.annualPlans.map(p => [
        p.bulan, p.program, p.tempat, p.catatan
      ]));
    }

    // 7. Tab Visual: KEHADIRAN (Rumusan)
    if (contents.attendances && contents.students) {
      updateSheet(ss, 'RUMUSAN_KEHADIRAN', ['TARIKH', 'JUMLAH HADIR', 'JUMLAH AHLI', 'PERATUS (%)'], contents.attendances.map(att => {
        var pct = contents.students.length ? Math.round((att.presents.length / contents.students.length) * 100) : 0;
        return [att.tarikh, att.presents.length, contents.students.length, pct + "%"];
      }));
    }

    return ContentService.createTextOutput("SUCCESS");

  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

function updateSheet(ss, name, headers, rows) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clear();
  
  // Header Style
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers])
    .setBackground('#1e293b') // Slate 800
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
    
  if (rows && rows.length > 0) {
    // Susun mengikut kolum pertama (A-Z) kecuali untuk Rancangan & Kehadiran
    if (name === 'AHLI' || name === 'GURU') {
      rows.sort((a, b) => a[0].localeCompare(b[0]));
    }
    
    sheet.getRange(2, 1, rows.length, headers.length)
      .setValues(rows)
      .setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
  }
  
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}