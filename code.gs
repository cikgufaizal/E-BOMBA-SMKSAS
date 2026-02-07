/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD CORE v11.4 (CHUNKED STORAGE)
 * Kod ini perlu disalin ke Google Apps Script Editor anda.
 */

const SYNC_SHEET = "DATABASE_SYNC";
const CHUNK_SIZE = 45000; // Pecahkan setiap 45k aksara (Had Google = 50k)

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
  
  // Ambil semua data dari Kolum A (Baris 1 hingga Baris Terakhir)
  var lastRow = sheet.getLastRow();
  if (lastRow < 1) return createNewSessionResponse();
  
  var values = sheet.getRange(1, 1, lastRow, 1).getValues();
  var fullJsonString = "";
  
  // Cantumkan semula pecahan JSON dari setiap baris
  for (var i = 0; i < values.length; i++) {
    var cellValue = values[i][0];
    if (cellValue != null) {
      fullJsonString += cellValue.toString();
    }
  }
  
  // Jika database masih kosong
  if (!fullJsonString || fullJsonString.trim() === "" || fullJsonString === "null") {
    return createNewSessionResponse();
  }
  
  try {
    // Validasi JSON
    JSON.parse(fullJsonString);
    return ContentService.createTextOutput(fullJsonString)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // Jika JSON rosak, pulangkan status error supaya Web App tidak overwrite data
    return createJsonResponse({ 
      status: "ERROR", 
      message: "Data dalam Sheet tidak lengkap/rosak. Sila Save semula dari App. " + err.toString() 
    });
  }
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput("FAILED: NO_DATA");
    }
    
    var payload = e.postData.contents;
    
    // Sahkan integriti JSON sebelum menulis ke Sheet
    JSON.parse(payload);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
    
    // 1. KOSONGKAN KOLUM A SEPENUHNYA
    sheet.getRange("A:A").clearContent();
    SpreadsheetApp.flush(); // Pastikan pemadaman selesai
    
    // 2. PECAHKAN PAYLOAD KEPADA KETULAN (CHUNKS)
    var chunks = [];
    for (var i = 0; i < payload.length; i += CHUNK_SIZE) {
      chunks.push([payload.substring(i, i + CHUNK_SIZE)]);
    }
    
    // 3. TULIS SEMUA CHUNKS KE KOLUM A (Batch update untuk kelajuan)
    if (chunks.length > 0) {
      sheet.getRange(1, 1, chunks.length, 1).setValues(chunks);
    }
    
    // 4. LOG METADATA DI KOLUM B
    sheet.getRange(1, 2).setValue("Last Sync: " + new Date().toLocaleString());
    sheet.getRange(2, 2).setValue("Total Size: " + payload.length + " chars");
    sheet.getRowHeight(1); // Refresh UI
    
    return ContentService.createTextOutput("SUCCESS");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.toString());
  }
}

function createNewSessionResponse() {
  return createJsonResponse({ 
    status: "NEW_SESSION", 
    students: [], 
    teachers: [], 
    committees: [], 
    attendances: [], 
    activities: [], 
    annualPlans: [] 
  });
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}