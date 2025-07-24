const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const xScore = document.getElementById("x-score");
const oScore = document.getElementById("o-score");
const draws = document.getElementById("draws");
const modeSelect = document.getElementById("mode");

let currentPlayer = "X";
let board = Array(9).fill("");
let scores = { X: 0, O: 0, Draw: 0 };
let gameActive = true;
let gameMode = "pvp"; // Default mode

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

modeSelect.addEventListener("change", () => {
  gameMode = modeSelect.value;
  resetGame();
});

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== "") return;

  makeMove(index, currentPlayer);

  if (!gameActive || gameMode === "pvp") return;

  // Delay AI move for realism
  setTimeout(() => {
    aiMove();
  }, 500);
}

function makeMove(index, player) {
  if (board[index] !== "") return;

  board[index] = player;
  cells[index].textContent = player;

  if (checkWinner(player)) {
    statusText.textContent = `${player} Wins!`;
    scores[player]++;
    updateScore();
    gameActive = false;
  } else if (board.every((cell) => cell !== "")) {
    statusText.textContent = "It's a Draw!";
    scores.Draw++;
    updateScore();
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s Turn`;
  }
}

function aiMove() {
  if (!gameActive) return;

  const emptyCells = board
    .map((val, i) => (val === "" ? i : null))
    .filter((i) => i !== null);

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  makeMove(randomIndex, "O");
}

function checkWinner(player) {
  return winPatterns.some((pattern) =>
    pattern.every((index) => board[index] === player)
  );
}

function updateScore() {
  xScore.textContent = scores.X;
  oScore.textContent = scores.O;
  draws.textContent = scores.Draw;
}

function resetGame() {
  board.fill("");
  cells.forEach((cell) => (cell.textContent = ""));
  currentPlayer = "X";
  statusText.textContent = `${currentPlayer}'s Turn`;
  gameActive = true;
}

cells.forEach((cell) => cell.addEventListener("click", handleClick));
resetButton.addEventListener("click", resetGame);
resetGame();
updateScore();
