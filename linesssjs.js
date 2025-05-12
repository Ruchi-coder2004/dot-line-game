let size = parseInt(prompt("Enter grid size:"));
let grid = document.querySelector(".grid");
let turnText = document.getElementById("turn");
let lines = new Set();
let squares = {};
let player1 = prompt("Enter player one name:");
let player2 = prompt("Enter player two name:");
let player = 1;
let selected = null;
let score1 = document.querySelector(".myScore1");
let score2 = document.querySelector(".myScore2");
let p1 = document.querySelector(".myname1");
let p2 = document.querySelector(".myname2");
let count1 = 0, count2 = 0;
let win = document.querySelector("#winner");

p1.innerText = `${player1}`;
p2.innerText = `${player2}`;

grid.style.display = "grid";
grid.style.gridTemplate = `repeat(${size}, 40px) / repeat(${size}, 40px)`;

function createGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < size * size; i++) {
        let dot = document.createElement("div");
        dot.className = "dot";
        dot.dataset.index = i;
        dot.onclick = () => dotClick(i);
        grid.appendChild(dot);
    }
    updateTurnText();
}

function updateTurnText() {
    turnText.innerText = `Turn: ${player === 1 ? player1 : player2}`;
}

function dotClick(i) {
    let dot = grid.children[i];

    // Change dot color on selection
    dot.style.backgroundColor = player === 1 ? "blue" : "red";

    if (selected === null) {
        selected = i;
        return;
    }

    if (validMove(selected, i)) {
        drawLine(selected, i);
        if (!checkSquares()) switchTurn();
    } else {
        alert("Invalid move!");
    }

    selected = null;
}

function validMove(i1, i2) {
    let diff = Math.abs(i1 - i2);
    return (diff === 1 || diff === size) && !lines.has(`${i1}-${i2}`);
}

function drawLine(i1, i2) {
    let dot1 = grid.children[i1], dot2 = grid.children[i2];
    let line = document.createElement("div");
    line.className = "line";

    let x1 = dot1.offsetLeft + 5, y1 = dot1.offsetTop + 5;
    let x2 = dot2.offsetLeft + 5, y2 = dot2.offsetTop + 5;

    line.style.position = "absolute";
    line.style.width = `${Math.hypot(x2 - x1, y2 - y1)}px`;
    line.style.height = "4px";
    line.style.background = "black";
    line.style.transformOrigin = "0 50%";
    line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg)`;
    line.style.top = `${y1}px`;
    line.style.left = `${x1}px`;

    grid.appendChild(line);
    lines.add(`${i1}-${i2}`);
    lines.add(`${i2}-${i1}`);
}

function checkSquares() {
    let newSquare = false;
    for (let r = 0; r < size - 1; r++) {
        for (let c = 0; c < size - 1; c++) {
            let i = r * size + c;
            if (!squares[i] && isSquareComplete(i)) {
                claimSquare(i);
                newSquare = true;
            }
        }
    }

    // If all possible squares are filled, declare the winner
    if (Object.keys(squares).length === (size - 1) * (size - 1)) {
        setTimeout(() => declareWinner(), 100);
    }

    return newSquare;
}

function isSquareComplete(i) {
    return (
        lines.has(`${i}-${i + 1}`) &&
        lines.has(`${i + 1}-${i + size + 1}`) &&
        lines.has(`${i + size}-${i + size + 1}`) &&
        lines.has(`${i}-${i + size}`)
    );
}

function claimSquare(i) {
    let square = document.createElement("div");
    square.className = "square";
    square.textContent = `P${player}`;
    square.style = `position:absolute; width:40px; height:40px; background:${player === 1 ? "blue" : "red"};
                    color:white; display:flex; align-items:center; justify-content:center;
                    top:${grid.children[i].offsetTop + 15}px; left:${grid.children[i].offsetLeft + 15}px;`;
    grid.appendChild(square);
    squares[i] = player;

    if (player === 1) {
        count1++;
        score1.innerText = count1;
    } else {
        count2++;
        score2.innerText = count2;
    }
}

function switchTurn() {
    player = 3 - player;
    updateTurnText();
}

function declareWinner() {
    if (count1 > count2) {
        win.innerText = `🏆 WINNER: ${player1} 🎉`;
    } else if (count2 > count1) {
        win.innerText = `🏆 WINNER: ${player2} 🎉`;
    } else {
        win.innerText = `🤝 IT'S A TIE!`;
    }
}

createGrid();
