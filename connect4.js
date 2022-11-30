/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const HEIGHT = 6;//Rows
const WIDTH = 7;//Columns

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let gameOver = false;
const divMessage = document.querySelector("#divMessage");
divMessage.innerHTML = "";
const resetBtn = document.querySelector("#resetBtn");

resetBtn.addEventListener("click", () => {
  window.location.reload();
});

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array

  for (let y = 0; y < HEIGHT /*Rows*/; y++) {
    const newRow = []; // Initialization for each row
    for (let x = 0; x < WIDTH /*Columns*/; x++) {
      newRow.push(''); //Adding 'x' number of empty colums to each row to generate the matrix
    }
    board.push(newRow);
  }
}


/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");

  // TODO: add comment for this code
  //this bloc of code generate the head row of the board 'column-top'. 
  const top = document.createElement("tr"); // Creation of the first head row  'column-top' 
  top.setAttribute("id", "column-top");// Adding 'id' to the first head row 'column-top'
  top.addEventListener("click", handleClick); // Adding click event listener to the first head row 'column-top'

  for (let x = 0; x < WIDTH /*Columns*/; x++) { // making a loop through columns
    const headCell = document.createElement("td");// Creation of new 'td'(Cell) for each column to the first head row 
    headCell.setAttribute("id", x); //Adding 'id' of new td for each column to the first head row 
    headCell.innerHTML = "&#10010;";

    top.append(headCell);// Adding new 'td'(Cell) to the first head row
  }
  htmlBoard.append(top);// Adding cell to board(table);


  // TODO: add comment for this code
  //in this section the all game cells to the board base on the number of Rows and Columns with two loop.
  for (let y = 0; y < HEIGHT/*Rows*/; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH/*Columns*/; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);// Adding 'id' to each cell. Rows indicices are row=[0,1,2,3,4,5,6] and col=[0,1,2,3,4,5] => ${y}-${x} => "0-0", "0-1", "0-2" etc.
      row.append(cell); //Adding cell to the row
    }

    htmlBoard.append(row); // Adding row to the board;

  }
}


/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0

  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) return y;// checking if this cell is empty and if so return the index 
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell

  if (!gameOver) {// Checking before placing piece into the board.
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`player-${currPlayer}`);
    const place = document.getElementById(`${y}-${x}`);
    place.append(piece);
  }

}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board

  board[y][x] = currPlayer;

  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    divMessage.innerHTML = `Player ${currPlayer} won!`;
    resetBtn.classList.remove('hidden');
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    divMessage.innerHTML = 'The game is a draw!';
    resetBtn.classList.remove('hidden');
    return endGame('The game is a draw!');
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  //This function check the four possibilities to win the game in four cases:
  //horizontal got 4 pieces with the same color 
  //vertical got 4 pieces with the same color 
  //diagonal right got 4 pieces with the same color 
  //diagonal left 4 pieces with the same color 
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        gameOver = true;
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
