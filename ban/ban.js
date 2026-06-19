const baseDate = new Date("2026-01-29");

// データ配列
const data = [
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

// 日付フォーマット M/D
function formatDate(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}/${d}`;
}

// テーブル生成
function generateTable(todayStr) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  const base = new Date(baseDate);
  const today = new Date(todayStr);

  base.setHours(0,0,0,0);
  today.setHours(0,0,0,0);

  const diffDays = Math.floor((today - base) / (1000 * 60 * 60 * 24));

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

    // 宴会チェック
    if (data[index][0] === "宴会") {
      row.classList.add("highlight");
    }

    row.innerHTML = `
      <td>${formatDate(start)}</td>
      <td>${formatDate(end)}</td>
      <td>${data[index][0]}</td>
      <td>${data[index][1]}</td>
      <td>${data[index][2]}</td>
    `;

    tbody.appendChild(row);

    currentDate.setDate(currentDate.getDate() + 3);
  }
}

// 初期設定
const todayInput = document.getElementById("todayInput");
const now = new Date();

const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');

todayInput.value = `${yyyy}-${mm}-${dd}`;

// 初回描画
generateTable(todayInput.value);

// 日付変更時
todayInput.addEventListener("change", () => {
  generateTable(todayInput.value);
});
