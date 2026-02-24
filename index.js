const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let size = 3;
let field;
let currentPlayer;
let gameOver;
const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
  field = Array.from({ length: size }, () => Array(size).fill(EMPTY));
  currentPlayer = CROSS;
  gameOver = false;
  renderGrid(size);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
  if (gameOver) return;
  if (field[row][col] !== EMPTY) return;

  field[row][col] = currentPlayer;
  renderSymbolInCell(currentPlayer, row, col);

  const win = checkWinner();

  if (win) {
    win.cells.forEach(([r, c]) =>
      renderSymbolInCell(field[r][c], r, c, 'red')
    );

    alert(`Победил ${win.player}`);
    gameOver = true;
    return;
  }

  if (isDraw()) {
    alert('Победила дружба');
    gameOver = true;
    return;
  }


  currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;
}
function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    startGame();
}

function isDraw() {
  return field.flat().every(cell => cell !== EMPTY);
}
function checkWinner() {

  for (let i = 0; i < size; i++) {
    if (field[i][0] !== EMPTY &&
        field[i].every(cell => cell === field[i][0])) {
      return {
        player: field[i][0],
        cells: field[i].map((_, j) => [i, j])
      };
    }
  }

  for (let j = 0; j < size; j++) {
    const column = field.map(row => row[j]);

    if (column[0] !== EMPTY &&
        column.every(cell => cell === column[0])) {
      return {
        player: column[0],
        cells: column.map((_, i) => [i, j])
      };
    }
  }

  const diag1 = field.map((row, i) => row[i]);

  if (diag1[0] !== EMPTY && diag1.every(c => c === diag1[0])) {
    return {
      player: diag1[0],
      cells: diag1.map((_, i) => [i, i])
    };
  }

  const diag2 = field.map((row, i) => row[size - i - 1]);

  if (diag2[0] !== EMPTY && diag2.every(c => c === diag2[0])) {
    return {
      player: diag2[0],
      cells: diag2.map((_, i) => [i, size - i - 1])
    };
  }

  return null;
}

/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
