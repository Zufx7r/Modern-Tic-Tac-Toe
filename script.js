document.addEventListener('DOMContentLoaded', () => {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const gameStatus = document.querySelector('.game-status');
  const resetButton = document.querySelector('.reset-button');

  let currentPlayer = 'X';  // human
  let board = ['', '', '', '', '', '', '', '', ''];
  let isGameActive = true;

  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  async function getAIMove(board, player) {
    // Notice: using absolute path to your API on neoxsite
    const res = await fetch(
      "https://neoxsite.netlify.app/.netlify/functions/tictactoe",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board, player })
      }
    );
    const data = await res.json();
    return data.bestMove;
  }

  function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
      const [aIndex, bIndex, cIndex] = winningConditions[i];
      let a = board[aIndex];
      let b = board[bIndex];
      let c = board[cIndex];

      if (a === '' || b === '' || c === '') continue;
      if (a === b && b === c) {
        roundWon = true;
        [aIndex, bIndex, cIndex].forEach(i => {
          cells[i].classList.add('winning');
        });
        break;
      }
    }

    if (roundWon) {
      gameStatus.textContent = `Player ${currentPlayer} has won!`;
      isGameActive = false;
      return true;
    }

    if (!board.includes('')) {
      gameStatus.textContent = `It's a draw!`;
      isGameActive = false;
      return true;
    }

    return false;
  }

  async function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s Turn`;

    // If it's AI’s turn
    if (currentPlayer === 'O' && isGameActive) {
      // Let the API decide the move
      const bestMove = await getAIMove(board, currentPlayer);
      // If the response is valid
      if (typeof bestMove === 'number') {
        const cell = cells[bestMove];
        if (cell && board[bestMove] === '') {
          board[bestMove] = currentPlayer;
          cell.textContent = currentPlayer;
          cell.classList.add(currentPlayer.toLowerCase());
          if (!handleResultValidation()) {
            // Continue the game
            changePlayer();
          }
        }
      } else {
        console.error("API returned invalid bestMove:", bestMove);
      }
    }
  }

  function userAction(cell, index) {
    if (!isGameActive || board[index] !== '' || currentPlayer !== 'X') {
      return;
    }
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    if (!handleResultValidation()) {
      changePlayer();
    }
  }

  function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s Turn`;

    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('x', 'o', 'winning');
    });
  }

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => userAction(cell, index));
  });
  resetButton.addEventListener('click', resetGame);

});