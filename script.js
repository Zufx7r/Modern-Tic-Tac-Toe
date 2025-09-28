document.addEventListener("DOMContentLoaded", () => {
    const cells = Array.from(document.querySelectorAll(".cell"));
    const gameStatus = document.querySelector(".game-status");
    const resetButton = document.querySelector(".reset-button");
    const modeButton = document.querySelector(".mode-button"); // NEW toggle button

    let currentPlayer = "X";
    let board = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;
    let singlePlayer = true; // default: AI mode

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function checkWinner(b, player) {
        return winningConditions.some(pattern =>
            pattern.every(index => b[index] === player)
        );
    }

    function handleResultValidation() {
        if (checkWinner(board, currentPlayer)) {
            gameStatus.textContent = `Player ${currentPlayer} has won!`;
            isGameActive = false;
            return true;
        }
        if (!board.includes("")) {
            gameStatus.textContent = "It's a draw!";
            isGameActive = false;
            return true;
        }
        return false;
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
        cells[move].textContent = "O";
        cells[move].classList.add("o");

        if (!handleResultValidation()) {
            currentPlayer = "X";
            gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }

    function userAction(cell, index) {
        if (isGameActive && board[index] === "") {
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase());
            if (!handleResultValidation()) {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                gameStatus.textContent = `Player ${currentPlayer}'s Turn`;

                if (singlePlayer && currentPlayer === "O" && isGameActive) {
                    setTimeout(aiMove, 400); // delay for realism
                }
            }
        }
    }

    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        currentPlayer = "X";
        gameStatus.textContent = `Player ${currentPlayer}'s Turn`;

        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("x", "o", "winning");
        });
    }

    // Toggle game mode (AI <-> 2 Player)
    modeButton.addEventListener("click", () => {
        singlePlayer = !singlePlayer;
        modeButton.textContent = singlePlayer ? "Switch to 2 Player" : "Switch to AI";
        resetGame();
    });

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => userAction(cell, index));
    });

    resetButton.addEventListener("click", resetGame);

    // Initial status
    gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
    modeButton.textContent = "Switch to 2 Player"; // initial label
});