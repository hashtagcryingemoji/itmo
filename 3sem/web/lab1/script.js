const canvas = document.getElementById("main-canvas");
const ctx = canvas.getContext("2d");
const form = document.getElementById("form");
const yInput = document.getElementById("y-input");
const rSelect = document.getElementById("r-select");
const errorMessage = document.getElementById("error-message");
const resultsBody = document.getElementById("results-body");
const xButtons = document.querySelectorAll(".x-button");
const comment = document.getElementById("comment");
const SCALE = 50;
const CENTER_X = canvas.width / 2;
const CENTER_Y = canvas.height / 2;
const R_VALUES = [1, 1.5, 2, 2.5, 3];
const saved = localStorage.getItem("results");
const clearButton = document.getElementById("clear-button");
const commentContent = localStorage.getItem("content")

console.log(commentContent);

function getR() {
    let index = rSelect.selectedIndex;
    if (index < 0 || index >= R_VALUES.length) {
        return null;
    }
    return R_VALUES[index];
}

let selectedX = null;
let results = [];
let commentText = commentContent === null ? "" : commentContent;
comment.textContent = commentText;

if (saved !== null) {
    results = JSON.parse(saved);
}

function showError(text) {
    errorMessage.textContent = text;
    errorMessage.style.display = "block";
}

function hideError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

function checkHit(x, y, r) {
    if (x >= 0 && y >= 0) {
        return x * x + y * y <= r * r;
    }
    if (x < 0 && y >= 0) {
        return x >= -r && y <= x + r;
    }
    if (x < 0 && y < 0) {
        return x >= -r && y >= -r / 2;
    }
    return false;
}

function addRow(result) {
    let row = document.createElement("tr");
    let hitText = result.hit ? "Попадание" : "Промах";
    let hitClass = result.hit ? "hit" : "miss";
    let timeText = new Date(result.time).toLocaleString("ru-RU");
    row.innerHTML =
        "<td>" + result.x + "</td>" +
        "<td>" + result.y + "</td>" +
        "<td>" + result.r + "</td>" +
        "<td class=\"" + hitClass + "\">" + hitText + "</td>" +
        "<td>" + timeText + "</td>";
    resultsBody.insertBefore(row, resultsBody.firstChild);
}

function renderTable() {
    resultsBody.innerHTML = "";
    for (let i = 0; i < results.length; i++) {
        addRow(results[i]);
    }
}

function drawScene(r, point) {
    let R = r * SCALE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(CENTER_X - R, CENTER_Y);
    ctx.lineTo(CENTER_X, CENTER_Y - R);
    ctx.arc(CENTER_X, CENTER_Y, R, -Math.PI / 2, 0);
    ctx.lineTo(CENTER_X, CENTER_Y);
    ctx.lineTo(CENTER_X, CENTER_Y + R / 2);
    ctx.lineTo(CENTER_X - R, CENTER_Y + R / 2);
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, CENTER_Y);
    ctx.lineTo(canvas.width, CENTER_Y);
    ctx.lineTo(canvas.width - 8, CENTER_Y - 4);
    ctx.moveTo(canvas.width, CENTER_Y);
    ctx.lineTo(canvas.width - 8, CENTER_Y + 4);
    ctx.moveTo(CENTER_X, canvas.height);
    ctx.lineTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X - 4, 8);
    ctx.moveTo(CENTER_X, 0);
    ctx.lineTo(CENTER_X + 4, 8);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    let ks = [-1, -0.5, 0.5, 1];

    ctx.beginPath();
    for (let i = 0; i < ks.length; i++) {
        ctx.moveTo(CENTER_X + ks[i] * R, CENTER_Y - 5);
        ctx.lineTo(CENTER_X + ks[i] * R, CENTER_Y + 5);
        ctx.moveTo(CENTER_X - 5, CENTER_Y - ks[i] * R);
        ctx.lineTo(CENTER_X + 5, CENTER_Y - ks[i] * R);
    }
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "12px serif";
    ctx.textAlign = "center";
    for (let i = 0; i < ks.length; i++) {
        ctx.fillText(String(ks[i] * r), CENTER_X + ks[i] * R, CENTER_Y + 18);
    }
    ctx.textAlign = "left";
    for (let i = 0; i < ks.length; i++) {
        ctx.fillText(String(ks[i] * r), CENTER_X + 8, CENTER_Y - ks[i] * R + 4);
    }
    ctx.fillText("x", canvas.width - 14, CENTER_Y - 8);
    ctx.fillText("y", CENTER_X + 8, 12);

    if (point !== null) {
        ctx.beginPath();
        ctx.arc(CENTER_X + point.x * SCALE, CENTER_Y - point.y * SCALE, 5, 0, 2 * Math.PI);
        ctx.fillStyle = point.hit ? "green" : "red";
        ctx.fill();
    }
}

for (let i = 0; i < xButtons.length; i++) {
    xButtons[i].addEventListener("click", function () {
        selectedX = Number(this.value);
        for (let j = 0; j < xButtons.length; j++) {
            xButtons[j].classList.remove("selected");
        }
        this.classList.add("selected");
        hideError();
    });
}

rSelect.addEventListener("change", function () {
    drawScene(getR(), null);
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (selectedX === null) {
        showError("Выберите значение X");
        return;
    }

    let yText = yInput.value.trim().replace(",", ".");
    let y = Number(yText);
    if (yText === "" || isNaN(y) || y < -3 || y > 5) {
        showError("Y должен быть числом в диапазоне от -3 до 5");
        return;
    }

    let r = getR();
    if (r === null || r <= 0) {
        showError("Некорректное значение R");
        return;
    }

    hideError();

    let result = {
        x: selectedX,
        y: y,
        r: r,
        hit: checkHit(selectedX, y, r),
        time: Date.now()
    };

    results.push(result);
    localStorage.setItem("results", JSON.stringify(results));
    addRow(result);
    drawScene(r, result);
});

clearButton.addEventListener("click", function () {
    results = [];
    localStorage.removeItem("results");
    resultsBody.innerHTML = "";
    drawScene(getR(), null);
});

renderTable();
if (results != null && results.length > 0) {
    let last = results[results.length - 1];
    rSelect.value = String(last.r);
    drawScene(last.r, last);
} else {
    drawScene(getR(), null);
}

comment.addEventListener("input", (e) => {
    const text = e.target.innerText;
    localStorage.setItem("content", text);
});
