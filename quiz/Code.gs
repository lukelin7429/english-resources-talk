/**
 * Dragon Boat Festival Quiz — backend
 * 端午節英文小考 — 後台（獨立 Apps Script 版本）
 *
 * 用法：
 *   1) 到 sheets.new 建一張新的 Google Sheet
 *   2) 從網址複製 Sheet ID：docs.google.com/spreadsheets/d/【這一段】/edit
 *   3) 把整份檔案貼到 script.google.com（新增專案）→ 把下面 SHEET_ID 換成你的
 *   4) 上方下拉選單選 _smokeTest → ▶ Run → 授權 → 看 Sheet 出現一筆 TEST 資料
 *   5) 右上 Deploy → New deployment → 類型 Web app
 *      Execute as: Me ／ Who has access: Anyone
 *      → 複製 Web app URL 給 Luke
 */

// ====== 設定：貼上你的 Google Sheet ID ======
const SHEET_ID   = "PASTE_YOUR_SHEET_ID_HERE";
// ===========================================

const SHEET_NAME = "Quiz Responses";
const HEADER = [
  "時間 Timestamp",
  "班級 Class",
  "英文名字 English Name",
  "分數 Score",
  "Q1 (festival from food)",
  "Q2 (festival activity)",
  "Q3 (the poet)",
  "Q4 (zongzi description)",
  "Q5 (dragon boat description)",
  "正確情形 Correctness (✓/✗)"
];

function doGet(e) {
  return ContentService
    .createTextOutput("Dragon Boat Quiz endpoint is alive. POST submissions here. · 端午小考 endpoint 正常運作中。")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADER);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADER.length)
        .setFontWeight("bold")
        .setBackground("#0A1F5C")
        .setFontColor("#FCC30B");
      sheet.setColumnWidth(1, 160);
      sheet.setColumnWidth(2, 140);
      sheet.setColumnWidth(3, 140);
      sheet.setColumnWidth(4, 70);
    }
    const p = e && e.parameter ? e.parameter : {};
    sheet.appendRow([
      new Date(),
      p.cls || "",
      p.name || "",
      p.score || "",
      p.q1 || "",
      p.q2 || "",
      p.q3 || "",
      p.q4 || "",
      p.q5 || "",
      p.correctness || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 選用：部署前可以先跑這個函式，確認權限與寫入正常。
 * 編輯器上方下拉選單選 _smokeTest → 按 ▶ Run
 */
function _smokeTest() {
  doPost({
    parameter: {
      cls: "TEST",
      name: "Smoke Test",
      score: "5",
      q1: "Dragon Boat Festival",
      q2: "Race dragon boats",
      q3: "Qu Yuan 屈原",
      q4: "A pyramid-shaped rice bundle in bamboo leaves",
      q5: "Dragon Boat Festival",
      correctness: "✓✓✓✓✓"
    }
  });
}
