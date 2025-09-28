<script>
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let singlePlayer = true; // set to false if you want only 2-player mode

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

function handleClick(e) {
  const index = e.target.getAttribute("data-index");

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.innerText = currentPlayer;

  if (checkWinner(board, currentPlayer)) {
    statusText.innerText = currentPlayer + " Wins!";
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.innerText = "Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (singlePlayer && currentPlayer === "O" && gameActive) {
    aiMove();
  }
}

function aiMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = "O";
  cells[move].innerText = "O";

  if (checkWinner(board, "O")) {
    statusText.innerText = "O Wins!";
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.innerText = "Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner(newBoard, "O")) return 10 - depth;
  if (checkWinner(newBoard, "X")) return depth - 10;
  if (!newBoard.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(b, player) {
  return winPatterns.some(pattern =>
    pattern.every(index => b[index] === player)
  );
}

cells.forEach(cell => cell.addEventListener("click", handleClick));

document.getElementById("restart").addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.innerText = "X's Turn";
  cells.forEach(cell => cell.innerText = "");
});
</script>