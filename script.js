document.addEventListener('DOMContentLoaded', () => {
    const cells = Array.from(document.querySelectorAll('.cell'));
    const gameStatus = document.querySelector('.game-status');
    const resetButton = document.querySelector('.reset-button');

    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let isGameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                // Highlight winning cells
                winCondition.forEach(index => cells[index].classList.add('winning'));
                break;
            }
        }

        if (roundWon) {
            gameStatus.textContent = `Player ${currentPlayer} has won!`;
            isGameActive = false;
            return;
        }

        if (!board.includes('')) {
            gameStatus.textContent = 'It\'s a draw!';
            isGameActive = false;
            return;
        }

        changePlayer();
    }

    function changePlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
    }

    function userAction(cell, index) {
        if (isGameActive && board[index] === '') {
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase()); // Add 'x' or 'o' class for styling
            handleResultValidation();
        }
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        currentPlayer = 'X';
        gameStatus.textContent = `Player ${currentPlayer}'s Turn`;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning'); // Remove all player and winning classes
        });
    }

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => userAction(cell, index));
    });

    resetButton.addEventListener('click', resetGame);
});