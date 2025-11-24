/*
 * GOOGLE APPS SCRIPT CODE
 * 1. Create a new Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Paste this code.
 * 4. Run 'setup()' once to create/format headers.
 * 5. Deploy > New Deployment > Web App > Execute as: Me > Who has access: Anyone.
 */

// Configuration
var SHEET_NAME = "Tags";

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Headers: tag_id, status, item_name, owner_phone, timestamp
    sheet.appendRow(["tag_id", "status", "item_name", "owner_phone", "timestamp"]);
  }
  
  // Apply formatting regardless of if it's new or existing
  sheet.setFrozenRows(1);
  var headerRange = sheet.getRange("A1:E1");
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#f3f4f6");
  headerRange.setBorder(true, true, true, true, true, true);
  
  // Set nice column widths
  sheet.setColumnWidth(1, 120); // tag_id
  sheet.setColumnWidth(2, 100); // status
  sheet.setColumnWidth(3, 200); // item_name
  sheet.setColumnWidth(4, 150); // owner_phone
  sheet.setColumnWidth(5, 180); // timestamp
}

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var id = e.parameter.id;
    if (!id) {
      return createResponse({ result: "error", message: "Missing ID" });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    // Fail gracefully if sheet doesn't exist yet
    if (!sheet) return createResponse({ result: "new" });

    var data = sheet.getDataRange().getValues();
    
    // Search for ID (Skip header)
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        var status = data[i][1];
        
        if (status === "Active") {
          var item = data[i][2];
          var phone = data[i][3];
          
          // Construct WhatsApp link
          var message = "Hi, I found your " + item + ". How can I return it safely?";
          var wa_link = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
          
          return createResponse({ 
            result: "found", 
            wa_link: wa_link,
            message: "Owner found"
          });
        }
        // If status is New or anything else, fall through to return 'new'
        return createResponse({ result: "new" });
      }
    }
    
    // IMPLICIT REGISTRATION:
    // If ID not found in sheet, we treat it as a valid "New" tag.
    return createResponse({ result: "new" });
    
  } catch (err) {
    return createResponse({ result: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // Parse JSON body
    var postData = JSON.parse(e.postData.contents);
    var id = postData.id;
    var item = postData.item;
    var phone = postData.phone;

    if (!id || !item || !phone) {
      return createResponse({ result: "error", message: "Missing data fields" });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      // Auto-create sheet if missing during post
      setup();
      sheet = ss.getSheetByName(SHEET_NAME);
    }

    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;

    // Find row to update
    for (var i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        rowIndex = i + 1; // 1-based index
        break;
      }
    }

    var timestamp = new Date();

    if (rowIndex === -1) {
      // Create new row if ID doesn't exist (Auto-provisioning)
      sheet.appendRow([id, "Active", item, phone, timestamp]);
    } else {
      // Update existing row
      sheet.getRange(rowIndex, 2).setValue("Active");
      sheet.getRange(rowIndex, 3).setValue(item);
      sheet.getRange(rowIndex, 4).setValue(phone);
      sheet.getRange(rowIndex, 5).setValue(timestamp);
    }

    return createResponse({ result: "success" });

  } catch (err) {
    return createResponse({ result: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}