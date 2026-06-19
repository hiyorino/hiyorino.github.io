const baseDate = new Date("2026-01-29");

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

function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function generateTable(todayStr) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  const base = new Date(baseDate);
  const today = new Date(todayStr);

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

const todayInput = document.getElementById("todayInput");
const now = new Date();

todayInput.value = now.toISOString().split('T')[0];

generateTable(todayInput.value);

todayInput.addEventListener("change", () => {
  generateTable(todayInput.value);
});
