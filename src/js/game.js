import swal from "sweetalert";

export default class Game {
  constructor(board, character) {
    this.board = board;
    this.boardSize = 3;
    this.character = character;
    this.activeCharacter = null;

    this.goblinHit = 0;
    this.missedHit = 0;
    this.win = 5;
    this.lost = 5;
    this.cells = document.querySelectorAll(".cell");
    this.listeners = [];
  }

  start() {
    this.redrawBoard();
    this.board.addEventListener("click", this.onBoardClick.bind(this));
    this.play();
  }

  redrawBoard() {
    this.board = this.board.getBoard(this.boardSize);
    const body = document.querySelector("body");
    const container = document.createElement("div");

    container.classList.add("container");
    container.innerHTML = "<h1>Ударь гоблина!</h1>";
    this.statistic = this.statisticContainer();
    container.appendChild(this.statistic);
    container.appendChild(this.board);
    body.insertBefore(container, body.firstChild);
    this.cells = [...this.board.children];
  }

  statisticContainer() {
    this.mainStatisticContainer = document.createElement("div");
    this.mainStatisticContainer.classList.add("status");
    this.mainStatisticContainer.innerHTML =
      'Убито гоблинов: <span id="dead">0</span><br>Кол-во промахов: <span id="lost">0</span>';
    return this.mainStatisticContainer;
  }

  generatePosition() {
    const position = Math.floor(Math.random() * this.boardSize ** 2);
    if (position === this.position) {
      this.generatePosition();
      return;
    }
    this.deletedCharacter();
    this.position = position;
    this.addCharacter();
  }

  deletedCharacter() {
    if (this.activeCharacter === null) {
      return;
    }
    this.cells[this.position].firstChild.remove();
  }

  addCharacter() {
    this.activeCharacter = this.character.getCharacter();
    this.cells[this.position].appendChild(this.activeCharacter);
  }

  onBoardClick(e) {
    e.preventDefault();
    this.goblinHit = document.querySelector("#dead");
    this.missedHit = document.querySelector("#lost");
    this.listeners.forEach((callback) => callback(e.target));

    if (e.target.classList.contains("goblin")) {
      this.goblinHit.textContent++;
      e.target.classList.remove("goblin");
    } else {
      this.missedHit.textContent++;
    }

    if (this.goblinHit.textContent >= this.win) {
      swal({
        title: "Ты выиграл!",
        text: "Ты чемпион!",
        icon: "success",
      });
      this.newGame();
    } else if (this.missedHit.textContent >= this.lost) {
      swal({
        title: "Ты проиграл!",
        text: "Попробуй ещё раз.",
        icon: "error",
      });
      this.newGame();
    }
  }

  newGame() {
    this.missedHit.textContent = 0;
    this.goblinHit.textContent = 0;
  }

  play() {
    setInterval(() => {
      this.generatePosition();
    }, 1000);
  }
}
