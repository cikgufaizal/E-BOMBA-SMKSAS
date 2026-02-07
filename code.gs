/**
 * SISTEM PENGURUSAN KADET BOMBA - CLOUD CORE v11.5 (MULTI-ROW SYNC)
 * Salin kod ini ke Google Apps Script anda.
 */

const SYNC_SHEET = "DATABASE_SYNC";
const CHUNK_SIZE = 45000; // Had per sel Google Sheets ialah 50k, kita guna 45k untuk selamat.

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SYNC_SHEET) || ss.insertSheet(SYNC_SHEET);
  
  // Ambil semua pecahan data dari Kolum A
  var lastRow = sheet.getLastRow();
  if (lastRow < 1) return createNewSessionResponse();
  
  var values = sheet.getRange(1, 1, lastRow, 1).getValues();
  var fullJsonString = "";
  
  // Cantumkan semula pecahan JSON
  for (var i = 0; i < values.length; i++) {
    var val = values[i][0];
    if (val != null) {
      fullJsonString += val.toString();
    }
  }
  
  if (!fullJsonString || fullJsonString.trim() === "" || fullJsonString === "null") {
    return createNewSessionResponse();
  }
  
  try {
    JSON.parse(fullJsonString); // Validasi integriti JSON
    return ContentService.createTextOutput(fullJsonString)
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return createJsonResponse({ 
      status: "ERROR", 
      message: "Data dalam Sheet rosak. Sila Save semula dari aplikasi. Ralat: " + err.toString() 
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
    
    // 1. Bersihkan Kolum A
    sheet.getRange("A:A").clearContent();
    SpreadsheetApp.flush(); 
    
    // 2. Pecahkan JSON kepada baris (Chunking)
    var chunks = [];
    for (var i = 0; i < payload.length; i += CHUNK_SIZE) {
      chunks.push([payload.substring(i, i + CHUNK_SIZE)]);
    }
    
    // 3. Simpan dalam Kolum A
    if (chunks.length > 0) {
      sheet.getRange(1, 1, chunks.length, 1).setValues(chunks);
    }
    
    // 4. Metadata di Kolum B
    sheet.getRange(1, 2).setValue("Updated: " + new Date().toLocaleString());
    sheet.getRange(2, 2).setValue("Total Size: " + payload.length + " chars");
    sheet.getRange(3, 2).setValue("Total Chunks: " + chunks.length);
    
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