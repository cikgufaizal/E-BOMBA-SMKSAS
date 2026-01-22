/**
 * SISTEM PENGURUSAN KADET BOMBA PROFESSIONAL - CLOUD BRIDGE v6.5
 * -----------------------------------------------------------------------------
 * ARAHAN:
 * 1. Buka Google Sheet baru.
 * 2. Klik menu 'Extensions' > 'Apps Script'.
 * 3. Padam kod sedia ada (myFunction) dan paste kod ini.
 * 4. Klik ikon Save (Disket).
 * 5. Klik butang 'Deploy' (biru) > 'New Deployment'.
 * 6. Pilih 'Web App'.
 * 7. Tetapkan:
 *    - Description: "API Kadet Bomba"
 *    - Execute as: "Me" (Sangat Penting!)
 *    - Who has access: "Anyone"
 * 8. Klik 'Deploy', kemudian 'Authorize Access' (guna akaun Google cikgu).
 * 9. Salin (Copy) 'Web App URL' yang terhasil dan simpan di dalam utils/storage.ts.
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
    if (!data || data === "") return createJsonResponse({ status: "EMPTY", message: "Tiada data tersimpan." });

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
    
    // Semakan sambungan (Heartbeat)
    if (contents.test) return ContentService.createTextOutput("CONNECTED");

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Simpan Data JSON Utama (Untuk Penyelarasan Web App)
    var dbSheet = ss.getSheetByName(DB_SHEET) || ss.insertSheet(DB_SHEET);
    dbSheet.clear();
    dbSheet.getRange(1, 1).setValue(postData);
    dbSheet.getRange(1, 2).setValue("Kemaskini Terakhir: " + new Date().toLocaleString());

    // 2. Kemaskini Tab Visual: AHLI
    if (contents.students) {
      updateVisualSheet(ss, 'AHLI', ['NAMA PENUH', 'NO KAD PENGENALAN', 'TINGKATAN', 'KELAS', 'JANTINA', 'KAUM'], contents.students.map(s => [
        s.nama, s.noKP, s.tingkatan, s.kelas, s.jantina, s.kaum
      ]));
    }

    // 3. Kemaskini Tab Visual: GURU
    if (contents.teachers) {
      updateVisualSheet(ss, 'GURU_PENASIHAT', ['NAMA GURU', 'JAWATAN', 'NO TELEFON'], contents.teachers.map(t => [
        t.nama, t.jawatan, t.telefon
      ]));
    }

    // 4. Kemaskini Tab Visual: CARTA ORGANISASI (AJK)
    if (contents.committees && contents.students) {
      var ajkRows = contents.committees.map(ajk => {
        var student = contents.students.find(s => s.id === ajk.studentId);
        return [ajk.jawatan, student ? student.nama : 'N/A', student ? student.tingkatan + " " + student.kelas : 'N/A'];
      });
      updateVisualSheet(ss, 'CARTA_ORGANISASI', ['JAWATAN', 'NAMA PENUH', 'TINGKATAN/KELAS'], ajkRows);
    }

    // 5. Kemaskini Tab Visual: AKTIVITI
    if (contents.activities) {
      updateVisualSheet(ss, 'LAPORAN_AKTIVITI', ['TARIKH', 'MASA', 'AKTIVITI', 'TEMPAT', 'ULASAN'], contents.activities.map(a => [
        a.tarikh, a.masa, a.nama, a.tempat, a.ulasan
      ]));
    }

    // 6. Kemaskini Tab Visual: KEHADIRAN
    if (contents.attendances && contents.students) {
      updateVisualSheet(ss, 'RUMUSAN_KEHADIRAN', ['TARIKH', 'BIL. HADIR', 'JUMLAH AHLI', 'PERATUS (%)'], contents.attendances.map(att => {
        var pct = contents.students.length ? Math.round((att.presents.length / contents.students.length) * 100) : 0;
        return [att.tarikh, att.presents.length, contents.students.length, pct + "%"];
      }));
    }

    return ContentService.createTextOutput("SUCCESS");

  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

function updateVisualSheet(ss, name, headers, rows) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  sheet.clear();
  
  // Reka Bentuk Header (Merah Bomba)
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers])
    .setBackground('#b91c1c')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
    
  if (rows && rows.length > 0) {
    // Susun data mengikut Nama (Kecuali Kehadiran/Aktiviti ikut tarikh)
    if (name === 'AHLI' || name === 'GURU_PENASIHAT') {
      rows.sort((a, b) => a[0].localeCompare(b[0]));
    }
    
    var dataRange = sheet.getRange(2, 1, rows.length, headers.length);
    dataRange.setValues(rows)
      .setBorder(true, true, true, true, true, true, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);
      
    dataRange.setVerticalAlignment('middle');
  }
  
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  for (var i = 1; i <= headers.length; i++) {
    sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 20); // Tambah sedikit ruang
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}