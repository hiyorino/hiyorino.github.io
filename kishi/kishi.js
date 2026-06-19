const board = document.getElementById("board");
const palette = document.getElementById("palette");

const pieces = ["DEL", "自", "卒", "士", "象", "砲", "馬", "車", "将"];

let currentPiece = "";
let touchFrom = null;
let ghost = null;
let currentTargetCell = null;

let longPressTimer = null;
const LONG_PRESS_TIME = 2000;

/* パレット */
const buttons = [];

pieces.forEach(p => {
  const btn = document.createElement("button");
  btn.textContent = p === "DEL" ? "消" : p;

  btn.onclick = () => {
    currentPiece = p;
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };

  buttons.push(btn);
  palette.appendChild(btn);
});

/* 駒 */
function setPiece(cell, piece) {
  cell.dataset.piece = piece;
  cell.textContent = piece === "DEL" ? "" : piece;
}

function getPiece(x, y) {
  return document.getElementById(`${x}_${y}`)?.dataset.piece || "";
}

/* 盤生成 */
for (let y = 1; y <= 9; y++) {
  for (let x = 1; x <= 8; x++) {

    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = `${x}_${y}`;

    cell.onclick = () => {
      if (!currentPiece) return;

      if (currentPiece === "DEL") setPiece(cell, "");
      else setPiece(cell, currentPiece);

      currentPiece = "";
      buttons.forEach(b => b.classList.remove("active"));

      updateAllHighlights();
    };

    cell.draggable = true;

    cell.ondragstart = e => {
      e.dataTransfer.setData("id", cell.id);
    };

    cell.ondrop = e => {
      const from = document.getElementById(e.dataTransfer.getData("id"));
      setPiece(cell, from.dataset.piece);
      setPiece(from, "");
      updateAllHighlights();
    };

    cell.ondragover = e => e.preventDefault();

    cell.addEventListener("touchstart", (e) => touchStart(cell, e));
    cell.addEventListener("touchmove", touchMove);
    cell.addEventListener("touchend", touchEnd);

    board.appendChild(cell);
  }
}

/* ゴースト */
function moveGhost(x, y) {
  if (!ghost) return;
  ghost.style.left = x + "px";
  ghost.style.top = y + "px";
}

/* タッチ開始 */
function touchStart(cell, e) {
  touchFrom = cell;

  const t = e.touches[0];

  ghost = document.createElement("div");
  ghost.className = "drag-ghost";
  ghost.textContent = cell.textContent;
  document.body.appendChild(ghost);

  moveGhost(t.clientX, t.clientY);

  longPressTimer = setTimeout(() => {
    if (touchFrom) {
      setPiece(touchFrom, "");
      updateAllHighlights();
    }

    if (ghost) ghost.remove();
    ghost = null;

    touchFrom = null;
  }, LONG_PRESS_TIME);
}

/* 移動 */
function touchMove(e) {
  const t = e.touches[0];

  moveGhost(t.clientX, t.clientY);

  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }

  const target = document.elementFromPoint(t.clientX, t.clientY);

  if (!target || !target.classList.contains("cell")) {
    if (currentTargetCell) {
      currentTargetCell.classList.remove("drag-target");
      currentTargetCell = null;
    }
    return;
  }

  if (currentTargetCell && currentTargetCell !== target) {
    currentTargetCell.classList.remove("drag-target");
  }

  currentTargetCell = target;
  currentTargetCell.classList.add("drag-target");
}

/* 終了 */
function touchEnd(e) {

  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }

  if (!touchFrom) return;

  if (ghost) {
    ghost.remove();
    ghost = null;
  }

  if (currentTargetCell) {
    currentTargetCell.classList.remove("drag-target");
    currentTargetCell = null;
  }

  const t = e.changedTouches[0];
  const target = document.elementFromPoint(t.clientX, t.clientY);

  if (!target || !target.classList.contains("cell")) return;

  /* 同位置なら何もしない */
  if (target === touchFrom) {
    touchFrom = null;
    return;
  }

  setPiece(target, touchFrom.dataset.piece);
  setPiece(touchFrom, "");

  updateAllHighlights();

  touchFrom = null;
}

/* 砲 */
function rocketScan(x, y, dx, dy, pos) {
  let found = false;
  let nx = x + dx;
  let ny = y + dy;

  while (nx >= 1 && nx <= 8 && ny >= 1 && ny <= 9) {
    const p = getPiece(nx, ny);

    if (!found) {
      if (p && p !== "自") found = true;
    } else {
      pos.push([nx, ny]);
    }

    nx += dx;
    ny += dy;
  }
}

/* ハイライト */
function updateAllHighlights() {

  document.querySelectorAll(".highlight-layer").forEach(e => e.remove());

  for (let y = 1; y <= 9; y++) {
    for (let x = 1; x <= 8; x++) {

      const p = getPiece(x, y);
      if (!p) continue;

      let pos = [];

      switch (p) {

        case "自":
        case "車":
          for (let i=y-1;i>=1;i--){ pos.push([x,i]); if(getPiece(x,i)) break;}
          for (let i=y+1;i<=9;i++){ pos.push([x,i]); if(getPiece(x,i)) break;}
          for (let i=x-1;i>=1;i--){ pos.push([i,y]); if(getPiece(i,y)) break;}
          for (let i=x+1;i<=8;i++){ pos.push([i,y]); if(getPiece(i,y)) break;}
          break;

        case "卒":
        case "将":
          pos = [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
          break;

        case "士":
          pos = [[x-1,y-1],[x+1,y-1],[x-1,y+1],[x+1,y+1]];
          break;

        case "象":
          pos = [[x-2,y-2],[x+2,y-2],[x-2,y+2],[x+2,y+2]];
          break;

        case "馬":
          pos = [
            [x+2,y+1],[x+2,y-1],
            [x-2,y+1],[x-2,y-1],
            [x+1,y+2],[x+1,y-2],
            [x-1,y+2],[x-1,y-2]
          ];
          break;

        case "砲":
          rocketScan(x,y,0,-1,pos);
          rocketScan(x,y,0,1,pos);
          rocketScan(x,y,-1,0,pos);
          rocketScan(x,y,1,0,pos);
          break;
      }

      pos.forEach(([px,py]) => {
        const c = document.getElementById(`${px}_${py}`);
        if (!c) return;

        const existing = c.querySelector(".highlight-layer");

        const isSelf = (p === "自");

        /* 既存がある場合 */
        if (existing) {

          /* ピンク（通常）が既にあるなら何もしない */
          if (!existing.classList.contains("blue")) {
            return;
          }

          /* 既存が青で、今回がピンクなら上書き */
          if (!isSelf) {
            existing.remove();
          } else {
            return;
          }
        }

        const d = document.createElement("div");

        if (isSelf) {
          d.className = "highlight-layer blue";
        } else {
          d.className = "highlight-layer";
        }

        c.appendChild(d);
      });
    }
  }
}
