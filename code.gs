/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD CORE v11.3 (ULTRA SYNC - CHUNKING)
 */

const SYNC_SHEET = "DATABASE_SYNC";
const CHUNK_SIZE = 45000; // Simpan bawah had 50,000 aksara untuk keselamatan

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
  
  // Ambil semua data dalam Kolum A (Chunked JSON)
  var lastRow = sheet.getLastRow();
  if (lastRow < 1) return createNewSessionResponse();
  
  var values = sheet.getRange(1, 1, lastRow, 1).getValues();
  var fullJsonString = "";
  
  // Cantumkan semula semua ketulan JSON dari baris A1, A2, A3...
  for (var i = 0; i < values.length; i++) {
    fullJsonString += values[i][0].toString();
  }
  
  if (!fullJsonString || fullJsonString.trim() === "" || fullJsonString === "null") {
    return createNewSessionResponse();
  }
  
  try {
    // Validasi JSON sebelum return (pilihan)
    JSON.parse(fullJsonString);
    return ContentService.createTextOutput(fullJsonString)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return createJsonResponse({ 
      status: "ERROR", 
      message: "Data dalam Sheet rosak. Sila 'Save' semula dari aplikasi. Ralat: " + err.toString() 
    });
  }
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput("FAILED: NO_DATA");
    }
    
    var payload = e.postData.contents;
    
    // Sahkan integriti JSON sebelum simpan
    JSON.parse(payload);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
    
    // 1. Kosongkan Kolum A sepenuhnya untuk data baru
    sheet.getRange("A:A").clearContent();
    SpreadsheetApp.flush(); 
    
    // 2. Pecahkan JSON kepada baris-baris (Chunks)
    var row = 1;
    for (var i = 0; i < payload.length; i += CHUNK_SIZE) {
      var chunk = payload.substring(i, i + CHUNK_SIZE);
      sheet.getRange(row, 1).setValue(chunk);
      row++;
    }
    
    // 3. Log Metadata di Kolum B
    sheet.getRange(1, 2).setValue("Updated: " + new Date().toLocaleString());
    sheet.getRange(2, 2).setValue("Size: " + payload.length + " chars");
    sheet.getRange(3, 2).setValue("Chunks: " + (row - 1));
    
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