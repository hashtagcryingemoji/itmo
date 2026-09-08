const r_input = document.getElementById("r")
const form = document.getElementById("burmalda")
const canvas = document.getElementById("main-canvas")
const ctx = canvas.getContext("2d")
const y_input = document.getElementById("y")
const buttons = document.querySelectorAll(".blank-class");
let x = null;
let y = null;
let r = null;

buttons.forEach(button => {
    button.addEventListener("click", () => {
        x = Number(button.value);
    });
});

function save() {
    localStorage.setItem("r", r_input.value)
    localStorage.setItem("y", y_input.value)
    localStorage.setItem("x", x)
}


form.addEventListener("submit", save)

if (localStorage.getItem("r") != null && localStorage.getItem("x") != null && localStorage.getItem("y") != null) {
    draw(Number(localStorage.getItem("r")), Number(localStorage.getItem("x")), Number(localStorage.getItem("y")))
}

function draw(r, x, y) {
    r *= 50;

    ctx.clearRect(0, 0, 600, 400);

    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(600, 200);
    ctx.moveTo(300, 0);
    ctx.lineTo(300, 400);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(300 - r, 200);
    ctx.lineTo(300, 200 - r);
    ctx.arc(300, 200, r, -Math.PI / 2, 0);
    ctx.lineTo(300, 200);
    ctx.lineTo(300, 200 + r / 2);
    ctx.lineTo(300 - r, 200 + r / 2);
    ctx.closePath();

    ctx.fillStyle = "rgba(0, 123, 255, 0.5)";
    ctx.strokeStyle = "rgba(0, 123, 255, 0.5)";
    ctx.lineWidth = 2;

    ctx.fill();
    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(300 - r, 195);
    ctx.lineTo(300 - r, 205);

    ctx.moveTo(300 - r / 2, 195);
    ctx.lineTo(300 - r / 2, 205);

    ctx.moveTo(300 + r / 2, 195);
    ctx.lineTo(300 + r / 2, 205);

    ctx.moveTo(300 + r, 195);
    ctx.lineTo(300 + r, 205);

    ctx.moveTo(295, 200 - r);
    ctx.lineTo(305, 200 - r);

    ctx.moveTo(295, 200 - r / 2);
    ctx.lineTo(305, 200 - r / 2);

    ctx.moveTo(295, 200 + r / 2);
    ctx.lineTo(305, 200 + r / 2);

    ctx.moveTo(295, 200 + r);
    ctx.lineTo(305, 200 + r);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText("-R", 300 - r, 220);
    ctx.fillText("-R/2", 300 - r / 2, 220);
    ctx.fillText("R/2", 300 + r / 2, 220);
    ctx.fillText("R", 300 + r, 220);

    ctx.textAlign = "left";

    ctx.fillText("R", 308, 200 - r);
    ctx.fillText("R/2", 308, 200 - r / 2);
    ctx.fillText("-R/2", 308, 200 + r / 2);
    ctx.fillText("-R", 308, 200 + r);

    ctx.beginPath();

    ctx.arc(
        300 + x * 50,
        200 - y * 50,
        5,
        0,
        2 * Math.PI
    );

    ctx.fillStyle = "red";
    ctx.fill();
}