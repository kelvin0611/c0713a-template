# 通用 App 骨架（template）

C0713A「AI Vibe Coding 遊戲設計」· 中三 STEM · 嶺南衡怡紀念中學

---

## 🚀 點開始（3 步）

1. **下載** —— 撳呢條 link 就會下載一個 zip：
   <https://github.com/kelvin0611/c0713a-template/archive/refs/heads/main.zip>
2. **解壓** —— 雙擊個 zip，會出一個資料夾 `c0713a-template-main`
3. **用 Cursor 開嗰個資料夾**，然後喺 Cursor 嘅 Terminal 打：
   ```bash
   python3 -m http.server 8000
   ```
   再用瀏覽器開 <http://localhost:8000>

> ⚠️ **唔可以就咁雙擊 `index.html`**。一定要用上面嘅 local server，
> 唔係嘅話瀏覽器會擋住 API 請求（CORS），你會見到一片空白。

睇下個 template 係咩樣：<https://kelvin0611.github.io/c0713a-template/>

---

## 呢個係咩

由「香港到站 App」抽出嚟嘅**空殼**：版面、CSS、狀態盒、helper 全部寫好，
只剩低 **5 個 function 嘅 `// TODO`** 等你填。

填完就係一個 app；**換一條 API 再填一次，就係另一個題目**。

```
template/
  index.html   ← 外殼（深色卡片版面），唔使改
  style.css    ← 所有樣式，唔使改
  app.js       ← 你嘅工作檔（淨係改呢個，入面有 5 個 TODO）
  README.md    ← 你呢份
  EXAMPLE-巴士app.md ← 示範：巴士 app 點用呢個骨架
```

---

## 點跑（同 starter 一樣，一定要用 local server）

直接雙擊 `index.html` 開嘅係 `file://`，瀏覽器會**封鎖** API 請求（CORS），
你會見到「攞唔到資料」但唔知點解。

```bash
cd classroom/template
python3 -m http.server 8000
```

然後瀏覽器開 <http://localhost:8000>。**改完 code 按 `Cmd + S` → 瀏覽器 `Cmd + R`。**

---

## 3 步換題目

### ① 定題目：你想要咩資料？

先用一句話答：**「我個 app 幫人睇咩？」**

答得出就一定對應到下面 5 格其中幾格：

| 骨架裡嘅 function | 你要答嘅問題 | 巴士 app 嘅答案 |
|---|---|---|
| `loadList()` | 一次顯示成個清單，清單係咩？ | 全港 792 條巴士路線 |
| `showDetail(id)` | 㩒清單一項之後，睇咩？ | 㩒 1A → 佢 35 個站 |
| `showInfo(id)` | 再㩒一層，睇咩？ | 㩒一個站 → 下一班仲有幾分鐘 |
| `loadOther()` | 有冇第二個來源要一齊睇？（可以冇） | 港鐵下一班車 |
| `startAutoRefresh()` | 邊啲數字會過期，要幾秒更新一次？ | 到站時間，15 秒 |

唔需要第二個來源，就當第 4 格唔存在（`loadOther()` 留白）。

**遊戲／工具都一樣通** —— 例如「猜數字遊戲」：清單＝難度、詳情＝謎題提示、
再深入＝答對之後嘅分數；「功課清單工具」：清單＝科目、詳情＝未交功課、
第二個來源＝學校 eClass 公告。骨架唔理你個題目係咩，只理你攞咩資料。

### ② 找 API：要**免 key ＋ 有 CORS**

- **免 key**：要註冊／要信用卡嘅一律唔好（學生機開唔到）。
- **有 CORS**：回應要有 `access-control-allow-origin: *`，唔係瀏覽器會封鎖。

去邊度搵：

| 來源 | 網址 | 有咩 |
|---|---|---|
| 政府資料一線通 | <https://data.gov.hk/tc/> | 交通、天氣、人口、康文署場地……全部免 key |
| HKO 開放數據 | <https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation_tc.pdf> | 即時天氣、9 日預報、警告 |
| Open-Meteo | <https://open-meteo.com/> | 全球天氣預報（免 key） |
| GitHub API | <https://api.github.com> | repo、issue、用戶（免 key，有次數限制） |

**點自己驗有冇 CORS**（Terminal）：

```bash
curl -s -D - -o /dev/null -H "Origin: http://localhost:8000" "你嘅 API 網址" | grep -i access-control
```

見到 `access-control-allow-origin: *` 就過關。冇呢行 → 用瀏覽器 fetch 一定失敗，
要另搵一個（或者用 `assets/` 嘅本機副本，見 repo `AGENTS.md`）。

喺瀏覽器 Console 打 `console.log(result)` 睇住回應個形狀 —— **唔好靠估**。

### ③ 換 API：改 `app.js` 一個地方 ＋ 幾個欄位名

`app.js` 最上面兩行：

```js
const API = "← 換成你嘅 API 網址";     // ← 換呢句，就換咗題目
const API_OTHER = "";                  // ← 第二個來源，冇就 ""
```

然後填 5 個 `// TODO`。**5 個 TODO 裡面，唯一要「諗」嘅係欄位名**：

```js
// TODO 3：抽出清單陣列。每個 API 個形狀唔同：
//   data.gov.hk 系列 → result.data
//   HKO 天氣        → result.temperature.data
//   普通 JSON       → 可能就係 result 本身
const items = 你嘅清單;
```

由巴士 app 換去天氣 app，**只係改咗 `API` 一句 ＋ 呢個欄位名**（實測見
`EXAMPLE-巴士app.md` 尾段）。fetch、狀態盒、for...of 畫掣、draw 入邊個容器
—— 全部一樣，唔使重寫。

---

## HTML 有咩容器（唔使改，但你要知邊個打邊個）

| id | 裝咩 | 邊個 function 會寫入去 |
|---|---|---|
| `#status` | 藍盒：載入中 | `showStatus("載入中…")` |
| `#error` | 紅盒：出錯 | `showError("攞唔到資料：" + error.message)` |
| `#empty` | 灰盒：冇資料（係正常狀態） | `showEmpty("暫時冇資料")` |
| `#list` | 清單（一格格可以㩒嘅掣） | `loadList()` |
| `#detail-title` | 詳情標題 | `showDetail()` |
| `#detail` | 詳情一行一行 | `showDetail()` |
| `#info` | 再深入一層 | `showInfo()` |
| `#other` | 第二個來源 | `loadOther()` |

三個狀態盒傳空字串 `""` 就會收埋。除咗呢三種狀態，**冇第四種**。

---

## 已經寫好嘅 helper（唔使填）

| helper | 做咩 |
|---|---|
| `showStatus(text)` / `showError(text)` / `showEmpty(text)` | 開／收三個狀態盒（傳 `""` 收） |
| `clearBox(id)` | 清空一個容器，避免新舊資料疊住 |
| `makeChip(text, onClick)` | 做一格格可以㩒嘅掣（放 `#list`） |
| `makeRow(main, sub, right, onClick)` | 做一行（放 `#detail` / `#info` / `#other`，`right` 係右邊大字） |
| `minutesLeft(timeText)` | 時間字串 → 「仲有幾分鐘」（你嘅 API 有時間先用得著） |

想改色／字級 → 改 `style.css` 最上面 `:root` 嘅變數，唔好硬編碼 hex。

---

## 3 個一定會撞到嘅坑

| 症狀 | 原因 |
|---|---|
| `undefined` / 畫面空白 | 清單收喺 `result.data`（或更深），唔係 `result` 本身 → `console.log(result)` 睇清楚 |
| 「攞唔到資料」／`CORS policy` 紅字 | 用咗 `file://` 開，冇開 local server；或者個 API 根本冇 CORS |
| 畫面停咗喺「載入中…」 | `fetch` 前面漏咗 `await`，或者 `json()` 前面漏咗 `await` |

卡住咗：開 Console（`Cmd + Option + I`）睇紅字 → 問 AI 時**貼你寫嘅 code ＋ 錯誤訊息**，
唔好叫佢「幫我寫成個 app」。

---

## 做完之後嘅挑戰題

- 加一個搜尋框，打關鍵字淨係顯示相關嗰幾項。
- `#list` 項目太多（幾百個）→ 只顯示頭 30 個，加「顯示更多」。
- 用 `minutesLeft()` 把時間顯示埋「幾點鐘」。
- 兩份來源合併一個格，按時間排序。
- `refreshOnce()` 成功之後喺狀態盒顯示「最後更新：16:32:05」。
