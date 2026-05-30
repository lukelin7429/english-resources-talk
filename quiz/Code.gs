/**
 * Dragon Boat Festival Quiz — backend
 * 端午節英文小考 — 後台
 *
 * Paste this entire file into Apps Script (Google Sheets → 擴充功能 Extensions → Apps Script)
 * 把整份檔案貼到 Google 試算表的 Apps Script 編輯器
 *
 * Then deploy as Web App:
 *   部署方式：
 *   1) 右上「部署 Deploy」→「新增部署作業 New deployment」
 *   2) 類型 Type：「網頁應用程式 Web app」
 *   3) 執行身分 Execute as：自己 Me (your Google account)
 *   4) 誰可以存取 Who has access：「任何人 Anyone」  ← 這一步很重要
 *   5) 部署 → 授權 → 複製「網頁應用程式網址 Web app URL」
 *
 * Then send that URL back to Luke / paste into quiz/index.html as BACKEND_URL.
 */

const SHEET_NAME = "Quiz Responses";
const HEADER = [
  "時間 Timestamp",
  "班級 Class",
  "英文名字 English Name",
  "分數 Score",
  "Q1: 哪個節日吃粽子？",
  "Q2: 端午節最有名的活動？",
  "Q3: 端午節紀念哪位詩人？",
  "Q4: 粽子長什麼樣子？",
  "Q5: 端午節的英文？",
  "正確情形 Correctness (✓/✗)"
];

function doGet(e) {
  return ContentService
    .createTextOutput("Dragon Boat Quiz endpoint is alive. POST submissions here. · 端午小考 endpoint 正常運作中。")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActive();
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
      sheet.setColumnWidth(1, 160); // timestamp
      sheet.setColumnWidth(2, 140); // class
      sheet.setColumnWidth(3, 140); // name
      sheet.setColumnWidth(4, 70);  // score
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
 * Optional helper: run this once from the editor to verify Sheet write permissions
 * before deploying the Web App. It appends a test row.
 * 選用：部署前可以先在編輯器跑這個函式，確認權限與寫入正常。
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
