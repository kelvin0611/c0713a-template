// ============================================================
//  通用 App 骨架 — 學生工作檔（app.js）
//  C0713A 中三 STEM
//
//  呢個骨架本來係「香港到站 App」嘅 code，抽出嚟變成任何題目都用得：
//  換一條 API、換幾個欄位名，就變成另一個 app（遊戲／工具／資料查詢都得）。
//
//  規則：
//    1. 一個功能 = 一個 fetch + 一次 render（唔加抽象層、唔加 config）
//    2. 你淨係要填 5 個 function 入面嘅 // TODO，其他唔使改
//    3. 全程用 async / await，唔用 .then（睇唔明）
//
//  換題目三步（詳情睇 README.md）：
//    ① 定題目 → ② 搵一個免 key、有 CORS 嘅 API → ③ 改下面嘅 API 同欄位名
// ============================================================


// ============================================================
//  第 0 部分：設定 —— 換題目主要就係改呢兩行網址
// ============================================================

// ⚠️ 呢句就係「換題目」嗰句。搵到 API 之後，將網址貼入引號中間。
//    例子：
//      天氣 → "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc"
//      巴士 → "https://data.etabus.gov.hk/v1/transport/kmb/route/"
const API = "← 換成你嘅 API 網址";

// 第二個資料來源（第 4 步用）。
// 唔需要第二個來源，就留返空字串 ""，第 4 步唔會出現任何嘢。
const API_OTHER = "← 換成你嘅第二個 API 網址（唔需要就寫 \"\"）";

// 每隔幾秒自動更新一次（第 5 步）
const REFRESH_SECONDS = 15;


// ============================================================
//  第 0.5 部分：共用工具 —— 已經寫好，唔使改
// ============================================================

// 記住而家揀咗邊一項（第 5 步自動刷新要用）
// id ＝ 呢一項嘅「身份證」（巴士 app 用嘅係車站 id）
const state = { id: "", name: "" };

// 三個狀態盒，喺 index.html 度已經有：藍＝載入中、紅＝錯誤、灰＝冇資料
// 傳空字串 "" 就會收埋個盒
function showStatus(text) {
  const box = document.getElementById("status");
  box.textContent = text;
  box.hidden = !text;
}

function showError(text) {
  const box = document.getElementById("error");
  box.textContent = text;
  box.hidden = !text;
}

function showEmpty(text) {
  const box = document.getElementById("empty");
  box.textContent = text;
  box.hidden = !text;
}

// 清空一個容器（避免新舊資料疊埋一齊）
function clearBox(id) {
  document.getElementById(id).innerHTML = "";
}

// 做一個可以㩒嘅細標籤（放去 #list 用）
function makeChip(text, onClick) {
  const button = document.createElement("button");
  button.className = "chip";
  button.textContent = text;
  button.onclick = onClick;
  return button;
}

// 做一行（放去 #detail / #info / #other 用）
//   main  ＝ 主要文字（會粗體）
//   sub   ＝ 次要文字（灰色，可以傳 ""）
//   right ＝ 右邊嘅大字（例如「8 分鐘」；可以傳 ""）
//   onClick ＝ 有嘅話就成行可以㩒
function makeRow(main, sub, right, onClick) {
  const row = document.createElement("div");
  row.className = "item";
  row.innerHTML = "<b>" + main + "</b>" +
                  "<span class='item-sub'>" + sub + "</span>" +
                  "<span class='item-right'>" + right + "</span>";
  if (onClick) {
    row.onclick = onClick;
    row.style.cursor = "pointer";
  }
  return row;
}

// 將一個時間字串（例：2026-09-17T16:30:00+08:00）變成「仲有幾分鐘」
// 呢個 function 只有你嘅 API 會回時間字串先用得著；唔需要可以無視。
function minutesLeft(timeText) {
  if (!timeText) return "—";
  const minutes = Math.round((new Date(timeText) - new Date()) / 60000);
  if (minutes <= 0) return "即將";
  return minutes + " 分鐘";
}


// ============================================================
//  第 1 步：攞第一份清單，畫成一個個可以㩒嘅掣（畫入 #list）
// ============================================================
//  換題目要改嘅位：
//    · API            ← 第 0 部分已經改好
//    · 清單喺回應邊個欄位（TODO 3）
//    · 每一項用邊個欄位做「顯示文字」同「身份證 id」（TODO 6）
async function loadList() {
  // TODO 1：showStatus("載入中…");  showError("");  showEmpty("");

  // TODO 2：用 await 攞資料 ——
  //           const response = await fetch(API);
  //           const result = await response.json();
  //         ⚠️ json() 前面一定要有 await，唔係會出 [object Promise]

  // TODO 3：抽出清單陣列。呢個係換題目最常撞板嘅位，每個 API 唔同：
  //           · data.gov.hk 系列 → result.data
  //           · HKO 天氣        → result.temperature.data
  //           · 普通 JSON       → 可能就係 result 本身
  //         用 console.log(result) 睇一睇個形狀，然後寫：
  //           const items = 你嘅清單;

  // TODO 4：clearBox("list") 清走上一次嘅掣

  // TODO 5：冇資料就唔好照畫 ——
  //           if (items.length === 0) { showEmpty("冇資料"); showStatus(""); return; }

  // TODO 6：用 for...of 逐項畫一個掣，appendChild 落 #list：
  //           const chip = makeChip(要顯示嘅文字, function () { showDetail(呢項嘅 id); });
  //           document.getElementById("list").appendChild(chip);
  //         ⚠️ 靠邊個欄位做「身份證」？每個 API 唔同：
  //            巴士 app 用 route（路線號碼）；天氣用 place（地區名）；
  //            冇 id 嘅話，用個名本身都得。

  // TODO 7：showStatus("") 收工（傳空字串就會收埋狀態盒）
}


// ============================================================
//  第 2 步：㩒一項，攞佢嘅詳情（畫入 #detail，標題寫入 #detail-title）
// ============================================================
//  巴士 app 嘅例子：㩒「1A」→ 出 1A 成條線 35 個站
//  換題目要改嘅位：API 個路徑點串（好多 API 係 API + "/" + id）
async function showDetail(id) {
  // TODO 1：記住而家揀咗邊一項（第 5 步自動刷新要用）
  //           state.id = id;  state.name = ...;

  // TODO 2：showStatus("載入中…");  showError("");  clearBox("detail");

  // TODO 3：用 id 拼出今次嘅網址，再 fetch。兩個常見寫法：
  //           const url = API + "/" + id;                       （放去路徑）
  //           const url = API + "?place=" + id;                  （放去查詢字串）
  //         再 const response = await fetch(url); const result = await response.json();

  // TODO 4：將顯示名寫入標題（用 .textContent，唔係 innerHTML）：
  //           document.getElementById("detail-title").textContent = 顯示名;

  // TODO 5：抽出詳情陣列（同 TODO 3 一樣，睇 console.log(result) 個形狀），
  //         冇資料就 showEmpty("呢一項冇資料")、showStatus("")、return。

  // TODO 6：showEmpty("") 收埋灰盒。

  // TODO 7：用 for...of 逐項畫一行入 #detail：
  //           const row = makeRow(主文字, 次文字, 右邊大字, null);
  //           document.getElementById("detail").appendChild(row);
  //         想畫「下一層」嘅話，第 4 個參數改成
  //           function () { showInfo(呢項嘅 id); }

  // TODO 8：showStatus("")
}


// ============================================================
//  第 3 步：再深入一層（畫入 #info）
// ============================================================
//  巴士 app 嘅例子：㩒一個站 → 見下一班車仲有幾分鐘
//  呢個 function 亦係第 5 步自動刷新會再叫嘅一個
async function showInfo(id) {
  // TODO 1：showStatus("載入中…");  showError("");  clearBox("info");

  // TODO 2：同第 2 步一樣，用 id 拼網址再 fetch，然後 await response.json()

  // TODO 3：抽出資料。注意有啲 API 係「一個物件」唔係陣列
  //         （例：result.data[id]），咁就要自己包成陣列先畫。

  // TODO 4：冇資料通常係「正常」狀態（例如收咗車、今日冇比賽），
  //         要出灰盒友善訊息，唔好出紅色錯誤：
  //           if (冇資料) { showEmpty("暫時冇資料"); showStatus(""); return; }

  // TODO 5：showEmpty("")

  // TODO 6：用 for...of 逐項畫一行入 #info，右邊用大字（例如「8 分鐘」）

  // TODO 7：showStatus("")
}


// ============================================================
//  第 4 步：第二個資料來源（畫入 #other）
// ============================================================
//  巴士 app 嘅例子：港鐵下一班車（同巴士 API 完全唔同來源）
//  呢一歩係「加分位」——冇第二個來源就成個 function 留白。
async function loadOther() {
  // TODO 0：冇第二個來源就 return（或者喺 index.html 刪走第 4 格）

  // TODO 1：showStatus("載入中…");  showError("");  clearBox("other"); showEmpty("");

  // TODO 2：同第 1 步一樣：await fetch(API_OTHER) → await response.json()

  // TODO 3：⚠️ 呢個 API 個形狀同你第 1 步嗰個唔同，要重新睇：
  //           · 可能唔係 result.data
  //           · 可能係 result.status === 0 代表「冇資料」（唔係壞咗）
  //           · 可能某個欄位有時有、有時冇 → 用 || [] 頂住

  // TODO 4：冇資料 → showEmpty("暫時冇資料")、showStatus("")、return

  // TODO 5：showEmpty("")

  // TODO 6：用 for...of 逐項畫一行入 #other

  // TODO 7：showStatus("")
}


// ============================================================
//  第 5 步：自動刷新 + 錯誤處理
// ============================================================
//  到站時間／股價／天氣係會過期嘅 —— 十幾秒前嘅數字已經係舊數字，
//  所以要用 setInterval 定時再攞一次。
//  ⚠️ 每次開新 timer 之前一定要 clearInterval，唔係 timer 會愈疊愈多，
//     個畫面會愈跳愈快。
//  ⚠️ 網絡斷咗、API 死咗，fetch 會 throw → 要用 try / catch 接住，
//     唔好當冇事發生（用戶要知發生咩事）。
let timer = 0;

async function startAutoRefresh(seconds) {
  // TODO 1：clearInterval(timer)  ← 先清走舊 timer，唔係會疊

  // TODO 2：timer = setInterval(refreshOnce, seconds * 1000)
  //         （傳 function 名落去就得，唔好寫 refreshOnce() —— 加括號係「即刻執行」）

  // TODO 3：將 #btn-refresh 嘅 textContent 改成 "自動刷新中…"，
  //         再設 disabled = true（唔想佢㩒完又㩒）

  // TODO 4：await refreshOnce()  ← 即刻先攞一次，唔使等十幾秒
}

async function refreshOnce() {
  // TODO 1：冇揀到嘢就提提用戶（唔係就靜靜咁 error）：
  //           if (state.id === "") { showError("先喺上面揀一項"); return; }

  // TODO 2：try / catch 包住「再攞一次最深一層嘅資料」：
  //           try { await showInfo(state.id); }
  //           catch (error) {
  //             showStatus("");                                     ← 收埋「載入中」
  //             showError("攞唔到資料，檢查下網絡：" + error.message);  ← 講清楚
  //           }
  //         （你嘅 app 最深一層可能係 showDetail，改成你嗰個名就得）
}


// ============================================================
//  啟動 —— 已經寫好，唔使改
// ============================================================

document.getElementById("btn-list").onclick = loadList;
document.getElementById("btn-other").onclick = loadOther;
document.getElementById("btn-refresh").onclick = function () { startAutoRefresh(REFRESH_SECONDS); };

// 打開網頁即刻行第 1 步
loadList();
