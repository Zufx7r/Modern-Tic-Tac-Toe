const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let board = Array(9).fill(null);
let currentPlayer = "X"; // Human always starts
let running = true;

// Start the game
function startGame() {
  cells.forEach(cell => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}
startGame();

async function cellClicked() {
  const index = this.getAttribute("cellIndex");

  if (board[index] || !running || currentPlayer !== "X") {
    return;
  }

  updateCell(this, index, currentPlayer);
  if (checkWinner()) return;

  // Switch to AI turn
  currentPlayer = "O";
  statusText.textContent = `AI is thinking...`;
  await aiTurn();
}

function updateCell(cell, index, player) {
  board[index] = player;
  cell.textContent = player;
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      statusText.textContent = `${board[a]} wins!`;
      running = false;
      return true;
    }
  }

  if (!board.includes(null)) {
    statusText.textContent = "Draw!";
    running = false;
    return true;
  }
  return false;
}

async function aiTurn() {
  const bestMove = await getAIMove(board, "O");
  if (bestMove !== -1 && board[bestMove] === null) {
    const cell = document.querySelector(`[cellIndex='${bestMove}']`);
    updateCell(cell, bestMove, "O");
  }

  if (checkWinner()) return;

  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

async function getAIMove(board, player) {
  try {
    const res = await fetch("/.netlify/functions/tictactoe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ board, player })
    });
    const data = await res.json();
    return data.bestMove;
  } catch (err) {
    console.error("Error fetching AI move:", err);
    return -1;
  }
}

function restartGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  running = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => (cell.textContent = ""));
}