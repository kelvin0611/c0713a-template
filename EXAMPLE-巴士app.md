# 示範：巴士到站 App 係點用呢個骨架

> 呢份係「對答案」。左邊係骨架嘅通用名，右邊係巴士 app 真正填咗嘅 code。
> 你換題目嘅時候，就係做同一件事：**留住形狀，換走內容。**

---

## 一、5 個 function 對照表

| 骨架（template） | 巴士 app（starter） | 容器 | 打邊個 API |
|---|---|---|---|
| `loadList()` | `loadRoutes()` | `#list` | `/route/` → 792 條路線 |
| `showDetail(id)` | `loadStops(route)` | `#detail` | `/route-stop/1A/outbound/1` ＋ `/stop/` → 35 個站 |
| `showInfo(id)` | `showEta(stopId, stopName)` | `#info` | `/stop-eta/...` → 下一班仲有幾分鐘 |
| `loadOther()` | `loadMtr(line, station)` | `#other` | `getSchedule.php` → 港鐵下一班車 |
| `startAutoRefresh()` ＋ `refreshOnce()` | 同名 | — | 每 15 秒再攞一次 + `try/catch` |

容器 id 對照（巴士 app 舊名 → 骨架通用名）：

```
#route-list → #list          #stop-list → #detail
#eta-list   → #info          #mtr-list  → #other
#eta-title  → #detail-title
#status / #error / #empty    （三個狀態盒，名一樣）
```

---

## 二、填好之後大概係咁（節錄）

```js
// ① 設定
const API = "https://data.etabus.gov.hk/v1/transport/kmb/route/";
const API_OTHER = "https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php";
const REFRESH_SECONDS = 15;
```

### `loadList()` — 792 條路線

```js
async function loadList() {
  showStatus("載入路線中…");
  showError("");

  const response = await fetch(API);
  const result = await response.json();
  const allRoutes = result.data;                 // ← 換題目最常改呢個欄位

  // 1600 行係「線 + 方向」→ 去重後 792 個號碼
  const numbers = [...new Set(allRoutes.map(function (r) { return r.route; }))];
  numbers.sort();

  clearBox("list");
  for (const number of numbers) {
    const chip = makeChip(number, function () { showDetail(number); });
    document.getElementById("list").appendChild(chip);
  }
  showStatus(numbers.length + " 條路線（㩒一個睇下）");
}
```

### `showDetail(id)` — 㩒 1A → 35 個站

```js
async function showDetail(id) {
  state.id = id;
  state.name = id;
  showStatus("載入 " + id + " 嘅車站…");
  showError("");
  clearBox("detail");

  const orderResponse = await fetch(API.replace("/route/", "/route-stop/" + id + "/outbound/1"));
  const orderResult = await orderResponse.json();
  const stopOrder = orderResult.data;            // [{ seq: "1", stop: "A3AD…" }, …]

  const nameResponse = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop/");
  const nameResult = await nameResponse.json();
  const nameById = {};
  for (const stop of nameResult.data) { nameById[stop.stop] = stop.name_tc; }

  document.getElementById("detail-title").textContent = id + " 嘅站";

  clearBox("detail");
  for (const item of stopOrder) {
    const name = nameById[item.stop] || "（未知車站）";
    const row = makeRow(item.seq + ". " + name, "", "›",
                        function () { showInfo(item.stop); });
    document.getElementById("detail").appendChild(row);
  }
  showStatus(id + " 共 " + stopOrder.length + " 個站");
}
```

> ⚠️ 真正嘅 starter 係用兩個 `await fetch` 一齊做，仲要示範「一次過攞全港站名
> 快過逐個站問（1 秒 vs 16 秒）」。骨架版本一樣得，呢度只係節錄。

### `showInfo(id)` — 下一班仲有幾分鐘

```js
async function showInfo(id) {
  showStatus("載入到站時間…");
  showError("");
  clearBox("info");

  const response = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/" + id);
  const result = await response.json();
  const etas = result.data;

  if (etas.length === 0) {                        // 「冇班次」係正常狀態
    showEmpty("呢個站暫時冇班次");
    showStatus("");
    return;
  }
  showEmpty("");

  for (const item of etas.slice(0, 8)) {
    const row = makeRow(item.route, "去 " + item.dest_tc, minutesLeft(item.eta), null);
    document.getElementById("info").appendChild(row);
  }
  showStatus("更新時間：" + new Date().toLocaleTimeString("zh-HK"));
}
```

### `loadOther()` — 港鐵

```js
async function loadOther() {
  showStatus("載入港鐵…");
  showError("");
  clearBox("other");

  const response = await fetch(API_OTHER + "?line=TWL&sta=CEN");
  const result = await response.json();

  // status 0 ＝ 收咗車／冇班次 → 灰盒，唔係紅色錯誤
  if (result.status === 0) {
    showEmpty("港鐵而家冇班次（可能收咗車）");
    showStatus("");
    return;
  }
  showEmpty("");

  const stationData = result.data["TWL-CEN"];
  for (const direction of ["UP", "DOWN"]) {
    const trains = stationData[direction] || [];   // 有時得一個方向
    for (const train of trains.slice(0, 3)) {
      const row = makeRow(direction === "UP" ? "上行" : "下行",
                          "去 " + train.dest, train.ttnt + " 分鐘", null);
      document.getElementById("other").appendChild(row);
    }
  }
  showStatus("港鐵 TWL · CEN");
}
```

### `startAutoRefresh()` ＋ `refreshOnce()`

```js
async function startAutoRefresh(seconds) {
  clearInterval(timer);                              // 唔清就會愈跳愈快
  timer = setInterval(refreshOnce, seconds * 1000);

  const button = document.getElementById("btn-refresh");
  button.textContent = "自動刷新中…";
  button.disabled = true;

  await refreshOnce();                               // 即刻先攞一次
}

async function refreshOnce() {
  if (state.id === "") {                             // 未揀站
    showError("先喺上面揀一個站");
    return;
  }
  try {
    await showInfo(state.id);                        // 再攞最深一層
  } catch (error) {                                  // 網絡斷、API 死
    showStatus("");
    showError("攞唔到資料，檢查下網絡：" + error.message);
  }
}
```

---

## 三、考驗：真嘅「換一句 API 就換題目」？

由巴士 app 換去**天氣 app**，實際要改嘅只有咁多：

```diff
- const API = "https://data.etabus.gov.hk/v1/transport/kmb/route/";
+ const API = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc";

- const allRoutes = result.data;                    // 巴士：清單喺 .data
+ const allItems  = result.temperature.data;        // 天氣：清單喺 .temperature.data

- const numbers = [...new Set(allRoutes.map(function (r) { return r.route; }))];
+ const places  = allItems;                         // 天氣本來已經一格一個地區
```

`#list` 就由「792 條路線掣」變成「地區氣溫掣」，之後 `showDetail` / `showInfo`
一樣照㩒 —— **HTML、CSS、狀態盒、helper 一個字都冇改過**。

實測輸出（headless Chrome 打真 API，見下方「實測結果」）。

---

## 四、實測結果（導師驗證用）

2026-09-18 用 headless Chrome（`uv run --with playwright`，`chromium.launch(channel="chrome")`）
開 local server 打真 API，**兩個變體嘅 `index.html` ＋ `style.css` 都由 `template/` 直接複製
過去，一個字都冇改過**。

### 測試 0：骨架原封不動（5 個 TODO 未填）

| 檢查 | 結果 |
|---|---|
| `pageerror` | **0 個** |
| console error | **0 個**（加咗自製 SVG favicon 之後連 favicon 404 都冇） |
| 7 個容器 `#status #error #empty #list #detail #info #other` | 全部存在 |
| `#status` 文字 | `準備中…`（唔係紅色錯誤） |
| `#list` / `#detail` / `#info` / `#other` 子項 | 全部 0（乾淨空白，唔係爆） |
| 逐個㩒 `重新載入` / `載入` / `自動刷新` | 冇反應、冇 error（因為 TODO 未填） |
| 版面 computed style | 底 `rgb(14,22,32)`、卡紙 `rgb(23,34,46)`、圓角 `14px`、字 `PingFang HK`、手機欄闊 406px |

### 測試 1：換成 **HKO 天氣**（`dataType=rhrread`）

改動：`const API = "…rhrread…"` 一句 ＋ 欄位名 `result.temperature.data`。

```
#status  →  27 個地區（㩒一個睇下）
#list    →  京士柏 香港天文台 黃竹坑 打鼓嶺 流浮山 大埔 沙田 屯門 將軍澳 西貢 長洲 …
            （27 個地區掣，全部真名，唔係 mock）
㩒「京士柏」→ #detail-title = 京士柏（地區）
              #detail        = 京士柏  現時氣溫  30°C
㩒詳情行     → #info          = 星期六 天晴。日間乾燥及酷熱。     33° / 27°
                              星期日 部分時間有陽光。…局部地區有驟雨。32° / 27°
                              星期一 大致多雲，有幾陣驟雨，局部有雷暴。31° / 27°
              #status        = 預報更新：2026-09-18T11:30:00+08:00
```

`pageerror` **0**、console error **0**。`#list` 由「792 條路線」變成「27 個地區」，
HTML／CSS／狀態盒／helper 全部原封不動。

### 測試 2：換成 **GitHub repo 清單**（完全另一個題目）

改動：`const API = "https://api.github.com/orgs/NousResearch/repos?per_page=100"` 一句
＋ 欄位名 `const items = result`（⚠️ 呢個 API **唔係** `result.data`，直接回陣列）。

```
#status → 100 個 repo（只畫頭 40 個）
#list   → llama.cpp  llm-chain  local_generative_agents  Obsidian  StripedHyenaTrainer …
㩒「llama.cpp」→ #detail = llama.cpp  （冇描述）  2 ★
```

`pageerror` **0**、console error **0**。同一個骨架，兩分鐘換完題目。

> 兩個變體嘅 `app.js` 都通過 `node --check`（語法正確）才跑。
> 驗證腳本：`/tmp/tpl-verify.py`（唔屬於本 repo，只係導師覆核用）。

