const baseDate = createJSTDate("2026-01-29");

// JST日付生成（重要）
function createJSTDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00+09:00");
  return date;
}

// JSTの今日取得
function getTodayJST() {
  const now = new Date();

  // UTCからJSTに変換
  const jst = new Date(now.getTime());

  return new Date(jst.getFullYear(), jst.getMonth(), jst.getDate());
}

// データ配列
const data1 = [
["親密","後継","-"],
["宴会","酒坊","元宝"],
["魅力","護送","-"],
["経験","漢方屋","売上"],
["家来","孫","-"],
["親密","後継","-"],
["宴会","酒坊","元宝"],
["魅力","護送","-"],
["経験","荘園","百花競艶"],
["家来","商戦","-"],
["親密","後継","-"],
["宴会","酒坊","元宝"],
["魅力","護送","-"],
["経験","養生所","売上"],
["家来","孫","-"],
["親密","後継","-"],
["宴会","酒坊","元宝"],
["魅力","護送","-"],
["経験","漢方屋","百花競艶"],
["家来","商戦","-"],
["親密","後継","-"],
["宴会","酒坊","元宝"],
["魅力","護送","-"],
["経験","荘園","売上"],
["家来","孫","-"],
["親密","後継","-"],
["宴会","酒坊","元宝"],
["魅力","護送","-"],
["経験","養生所","百花競艶"],
["家来","商戦","-"]
];

const data2 = [
["親密","後継","-"],
["魅力","護送","-"],
["宴会","酒坊","元宝"],
["経験","漢方屋","売上"],
["家来","孫","-"],
["親密","後継","-"],
["魅力","護送","-"],
["宴会","酒坊","元宝"],
["経験","荘園","百花競艶"],
["家来","商戦","-"],
["親密","後継","-"],
["魅力","護送","-"],
["宴会","酒坊","元宝"],
["経験","養生所","売上"],
["家来","孫","-"],
["親密","後継","-"],
["魅力","護送","-"],
["宴会","酒坊","元宝"],
["経験","漢方屋","百花競艶"],
["家来","商戦","-"],
["親密","後継","-"],
["魅力","護送","-"],
["宴会","酒坊","元宝"],
["経験","荘園","売上"],
["家来","孫","-"],
["親密","後継","-"],
["魅力","護送","-"],
["宴会","酒坊","元宝"],
["経験","養生所","百花競艶"],
["家来","商戦","-"]
];

// 日付フォーマット M/D（JSTで扱う）
function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function generateTable(todayStr) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  const base = new Date(baseDate);
  const today = createJSTDate(todayStr);

  base.setHours(0,0,0,0);
  today.setHours(0,0,0,0);

  const diffDays = Math.floor((today - base) / 86400000);

  const A = Math.floor(diffDays / 3);
  const B = A % 30;

  const remainder = diffDays % 3;
  let baseStartDate = new Date(today);
  baseStartDate.setDate(today.getDate() - remainder);

  let currentDate = new Date(baseStartDate);

  for (let i = 0; i < 30; i++) {

    let start = new Date(currentDate);
    let end = new Date(currentDate);
    end.setDate(start.getDate() + 2);

    let index = (B + i) % 30;
    let row = document.createElement("tr");
    
    let data = data1;
    
    const targetDate1 = new Date("2026-06-16T00:00:00+09:00"); // JST固定
    const targetDate2 = new Date("2026-07-16T00:00:00+09:00"); // JST固定
    const today = new Date();

    // JSTで比較したい場合（おすすめ）
    const todayJST = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (todayJST >= targetDate1) {
      data = data2;
    }
    if (todayJST >= targetDate2) {
      data = data1;
    }

    if (data[index][0] === "宴会") {
      row.classList.add("highlight");
    }

    row.innerHTML = `
      <td data-label="開始日">${formatDate(start)}</td>
      <td data-label="終了日">${formatDate(end)}</td>
      <td data-label="番付1">${data[index][0]}</td>
      <td data-label="番付2">${data[index][1]}</td>
      <td data-label="番付3">${data[index][2]}</td>
    `;

    tbody.appendChild(row);

    currentDate.setDate(currentDate.getDate() + 3);
  }
}

// 初期設定（JST基準）
const todayInput = document.getElementById("todayInput");
const nowJST = getTodayJST();

// yyyy-mm-dd形式
const yyyy = nowJST.getFullYear();
const mm = String(nowJST.getMonth() + 1).padStart(2, '0');
const dd = String(nowJST.getDate()).padStart(2, '0');

todayInput.value = `${yyyy}-${mm}-${dd}`;

// 初回描画
generateTable(todayInput.value);

// 日付変更
todayInput.addEventListener("change", () => {
  generateTable(todayInput.value);
});
``