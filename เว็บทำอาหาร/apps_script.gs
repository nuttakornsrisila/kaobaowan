/**
 * Apps Script for receiving orders (POST JSON) and writing to Google Sheets.
 *
 * Usage:
 * - If you add this script inside the target Google Spreadsheet (container-bound), leave SPREADSHEET_ID = ''
 *   and the script will use SpreadsheetApp.getActiveSpreadsheet().
 * - If this script is standalone, set SPREADSHEET_ID to your sheet's ID and it will open by id.
 *
 * Deploy: Deploy -> New deployment -> Select type: Web app
 * - Execute as: Me
 * - Who has access: Anyone (or Anyone, even anonymous) depending on your account
 */

var SPREADSHEET_ID = ''; // <-- ถ้าเป็น standalone ให้ใส่ ID ของ Spreadsheet ที่ต้องการ

function _getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function _ensureHeader(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}

function doPost(e) {
  try {
    var payload;
    if (e.postData && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      payload = JSON.parse(e.postData.contents);
    } else if (e.parameter && Object.keys(e.parameter).length) {
      payload = e.parameter;
      if (payload.items && typeof payload.items === 'string') {
        try { payload.items = JSON.parse(payload.items); } catch (er) { }
      }
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({status:'error', message:'No payload'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = _getSpreadsheet();

    // If payload contains an action, handle special workflows
    var action = payload.action || (e.parameter && e.parameter.action) || '';

    // --- createPending: store order into Pending sheet ---
    if (action === 'createPending'){
      var pendingSheet = ss.getSheetByName('Pending');
      if(!pendingSheet) pendingSheet = ss.insertSheet('Pending');
      _ensureHeader(pendingSheet, ['PendingID','Timestamp','Total','Items_JSON','OrderedBy','Username','Status']);

      var pendingId = String(new Date().getTime());
      var ts = payload.timestamp || new Date().toLocaleString();
      var total = Number(payload.total) || 0;
      var itemsJson = JSON.stringify(payload.items || []);
      var orderedBy = payload.orderedBy || '';
      var username = payload.username || '';
      var status = 'pending';

      pendingSheet.appendRow([pendingId, ts, total, itemsJson, orderedBy, username, status]);

      return ContentService
        .createTextOutput(JSON.stringify({status:'success', pendingId: pendingId}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // --- confirmPending: move a pending row into Orders + Ledger and delete pending ---
    if (action === 'confirmPending'){
      var pendingSheet = ss.getSheetByName('Pending');
      if(!pendingSheet) return ContentService.createTextOutput(JSON.stringify({status:'error', message:'Pending sheet not found'})).setMimeType(ContentService.MimeType.JSON);
      var pendingId = payload.pendingId || '';
      if(!pendingId) return ContentService.createTextOutput(JSON.stringify({status:'error', message:'missing pendingId'})).setMimeType(ContentService.MimeType.JSON);

      var data = pendingSheet.getDataRange().getValues();
      var header = data[0] || [];
      var foundRow = -1;
      for(var i=1;i<data.length;i++){
        if(String(data[i][0]) === String(pendingId)) { foundRow = i+1; break; }
      }
      if(foundRow === -1) return ContentService.createTextOutput(JSON.stringify({status:'error', message:'pendingId not found'})).setMimeType(ContentService.MimeType.JSON);

      var row = pendingSheet.getRange(foundRow,1,1, pendingSheet.getLastColumn()).getValues()[0];
      var id = row[0];
      var ts = row[1];
      var total = Number(row[2]) || 0;
      var itemsJson = row[3];
      var orderedBy = row[4] || '';
      var username = row[5] || '';

      // append to Orders
      var ordersSheet = ss.getSheetByName('Orders');
      if (!ordersSheet) ordersSheet = ss.insertSheet('Orders');
      _ensureHeader(ordersSheet, ['Timestamp','Total','Items_JSON','OrderedBy','Username']);
      ordersSheet.appendRow([ts, total, itemsJson, orderedBy, username]);

      // update ledger
      var ledgerSheet = ss.getSheetByName('รายรับรายจ่าย');
      if (!ledgerSheet) ledgerSheet = ss.insertSheet('รายรับรายจ่าย');
      _ensureHeader(ledgerSheet, ['วันที่/เวลา','รายการ','รายรับ','รายจ่าย','คงเหลือ']);
      var lastRow = ledgerSheet.getLastRow();
      var lastBalance = 0;
      if (lastRow >= 2) {
        lastBalance = Number(ledgerSheet.getRange(lastRow, 5).getValue()) || 0;
      }
      var income = total;
      var expense = 0;
      var description = 'ขายอาหาร (Order)';
      var newBalance = lastBalance + income - expense;
      ledgerSheet.appendRow([ts, description, income, expense, newBalance]);

      // delete pending row
      pendingSheet.deleteRow(foundRow);

      return ContentService.createTextOutput(JSON.stringify({status:'success'})).setMimeType(ContentService.MimeType.JSON);
    }

    // --- default: direct Orders POST (backwards compatible) ---
    var ordersSheet = ss.getSheetByName('Orders');
    if (!ordersSheet) ordersSheet = ss.insertSheet('Orders');
    _ensureHeader(ordersSheet, ['Timestamp','Total','Items_JSON','OrderedBy','Username']);

    var ts = payload.timestamp || new Date().toLocaleString();
    var total = Number(payload.total) || 0;
    var itemsJson = JSON.stringify(payload.items || []);
    var orderedBy = payload.orderedBy || '';
    var username = payload.username || '';

    ordersSheet.appendRow([ts, total, itemsJson, orderedBy, username]);

    // Ledger sheet 'รายรับรายจ่าย'
    var ledgerSheet = ss.getSheetByName('รายรับรายจ่าย');
    if (!ledgerSheet) ledgerSheet = ss.insertSheet('รายรับรายจ่าย');
    _ensureHeader(ledgerSheet, ['วันที่/เวลา','รายการ','รายรับ','รายจ่าย','คงเหลือ']);

    // คำนวณยอดคงเหลือล่าสุด
    var lastRow = ledgerSheet.getLastRow();
    var lastBalance = 0;
    if (lastRow >= 2) {
      lastBalance = Number(ledgerSheet.getRange(lastRow, 5).getValue()) || 0;
    }

    var income = total;
    var expense = 0;
    var description = 'ขายอาหาร (Order)';
    var newBalance = lastBalance + income - expense;

    ledgerSheet.appendRow([ts, description, income, expense, newBalance]);

    return ContentService
      .createTextOutput(JSON.stringify({status:'success'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('doPost error: ' + err);
    return ContentService
      .createTextOutput(JSON.stringify({status:'error', message: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: small GET to verify web app is reachable
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status:'ok', message:'Apps Script Web App is running'}))
    .setMimeType(ContentService.MimeType.JSON);
}
