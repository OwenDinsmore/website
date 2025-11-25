/**
 * Backgammon Game Module - Terminal Theme
 * Lazy-loaded when user clicks Play
 *
 * NOTE: Bot opponent to be added later
 */

export class Backgammon {
  constructor(container) {
    this.container = container;
    this.board = container.querySelector('.backgammon-board');
    this.statusEl = container.querySelector('.backgammon-status');
    this.playBtn = container.querySelector('.backgammon-play-btn');
    this.die1 = container.querySelector('#die1');
    this.die2 = container.querySelector('#die2');

    this.gamePhase = 'waiting'; // 'waiting', 'first_roll', 'playing'
    this.currentPlayer = null;
    this.dice = [1, 1];
    this.movesLeft = [];
    this.selectedPoint = null;
    this.hasRolled = false;

    // Board state: indices 0-23 are points 1-24
    // Positive = white pieces, Negative = green pieces
    this.boardState = new Array(24).fill(0);
    // Bar: pieces that were hit
    this.barWhite = 0;
    this.barGreen = 0;
    // Home: pieces that have borne off
    this.homeWhite = 0;
    this.homeGreen = 0;

    this.init();
  }

  init() {
    this.setupInitialPosition();
    this.setupEventListeners();
    this.render();
    this.setStatus('> game loaded. click [ PLAY ] to start');
  }

  setupInitialPosition() {
    this.boardState = new Array(24).fill(0);
    this.barWhite = 0;
    this.barGreen = 0;
    this.homeWhite = 0;
    this.homeGreen = 0;

    // White pieces (positive numbers) - moves 24 -> 1
    this.boardState[23] = 2;   // Point 24: 2 white
    this.boardState[12] = 5;   // Point 13: 5 white
    this.boardState[7] = 3;    // Point 8: 3 white
    this.boardState[5] = 5;    // Point 6: 5 white

    // Green pieces (negative numbers) - moves 1 -> 24
    this.boardState[0] = -2;   // Point 1: 2 green
    this.boardState[11] = -5;  // Point 12: 5 green
    this.boardState[16] = -3;  // Point 17: 3 green
    this.boardState[18] = -5;  // Point 19: 5 green
  }

  setupEventListeners() {
    // Play button
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.handlePlayClick());
    }

    // Dice clicks
    if (this.die1) {
      this.die1.addEventListener('click', () => this.handleDiceClick());
    }
    if (this.die2) {
      this.die2.addEventListener('click', () => this.handleDiceClick());
    }

    // Point clicks
    const points = this.board.querySelectorAll('.backgammon-point');
    points.forEach(point => {
      point.addEventListener('click', () => {
        const pointNum = parseInt(point.dataset.point);
        if (pointNum) {
          this.handlePointClick(pointNum - 1);
        }
      });
    });
  }

  handlePlayClick() {
    if (this.gamePhase === 'waiting' || this.gamePhase === 'playing') {
      this.startGame();
    }
  }

  startGame() {
    this.gamePhase = 'first_roll';
    this.currentPlayer = null;
    this.hasRolled = false;
    this.movesLeft = [];
    this.selectedPoint = null;
    this.setupInitialPosition();
    this.render();

    // Reset dice display
    if (this.die1) this.die1.dataset.value = '1';
    if (this.die2) this.die2.dataset.value = '1';

    if (this.playBtn) {
      this.playBtn.textContent = '[ RESET ]';
    }

    this.setStatus('> roll dice to determine who goes first');
  }

  handleDiceClick() {
    if (this.gamePhase === 'waiting') {
      this.setStatus('> click [ PLAY ] to start');
      return;
    }

    if (this.gamePhase === 'first_roll') {
      this.rollForFirst();
      return;
    }

    if (this.gamePhase === 'playing') {
      this.rollDice();
    }
  }

  rollForFirst() {
    // Animate dice
    if (this.die1) this.die1.classList.add('rolling');
    if (this.die2) this.die2.classList.add('rolling');

    setTimeout(() => {
      // Roll until they're different (standard rule)
      let d1, d2;
      do {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
      } while (d1 === d2);

      this.dice = [d1, d2];

      if (this.die1) {
        this.die1.dataset.value = d1.toString();
        this.die1.classList.remove('rolling');
      }
      if (this.die2) {
        this.die2.dataset.value = d2.toString();
        this.die2.classList.remove('rolling');
      }

      // Higher roll goes first and uses both dice
      if (d1 > d2) {
        this.currentPlayer = 'white';
        this.setStatus(`> WHITE rolls ${d1}, GREEN rolls ${d2} - WHITE goes first!`);
      } else {
        this.currentPlayer = 'green';
        this.setStatus(`> WHITE rolls ${d1}, GREEN rolls ${d2} - GREEN goes first!`);
      }

      // Set up moves for the first player using both dice values
      this.movesLeft = [d1, d2];
      this.hasRolled = true;
      this.gamePhase = 'playing';

      setTimeout(() => {
        const player = this.currentPlayer.toUpperCase();
        this.setStatus(`> ${player}'s turn - moves: ${this.movesLeft.join(', ')} - select a piece`);
      }, 1500);

    }, 400);
  }

  rollDice() {
    if (this.hasRolled && this.movesLeft.length > 0) {
      this.setStatus(`> must use moves: ${this.movesLeft.join(', ')} - select a piece`);
      return;
    }

    // Animate
    if (this.die1) this.die1.classList.add('rolling');
    if (this.die2) this.die2.classList.add('rolling');

    setTimeout(() => {
      this.dice[0] = Math.floor(Math.random() * 6) + 1;
      this.dice[1] = Math.floor(Math.random() * 6) + 1;

      // Doubles = 4 moves
      if (this.dice[0] === this.dice[1]) {
        this.movesLeft = [this.dice[0], this.dice[0], this.dice[0], this.dice[0]];
      } else {
        this.movesLeft = [this.dice[0], this.dice[1]];
      }

      if (this.die1) {
        this.die1.dataset.value = this.dice[0].toString();
        this.die1.classList.remove('rolling');
      }
      if (this.die2) {
        this.die2.dataset.value = this.dice[1].toString();
        this.die2.classList.remove('rolling');
      }

      this.hasRolled = true;
      const player = this.currentPlayer.toUpperCase();
      this.setStatus(`> ${player} rolled ${this.dice[0]}, ${this.dice[1]} - select a piece`);

    }, 400);
  }

  handlePointClick(pointIndex) {
    if (this.gamePhase !== 'playing') return;

    if (!this.hasRolled || this.movesLeft.length === 0) {
      this.setStatus('> roll the dice first');
      return;
    }

    const pieces = this.boardState[pointIndex];
    const isWhitePiece = pieces > 0;
    const isGreenPiece = pieces < 0;
    const isCurrentPlayerPiece =
      (this.currentPlayer === 'white' && isWhitePiece) ||
      (this.currentPlayer === 'green' && isGreenPiece);

    if (this.selectedPoint === null) {
      if (isCurrentPlayerPiece) {
        this.selectedPoint = pointIndex;
        this.highlightValidMoves(pointIndex);
        this.setStatus(`> point ${pointIndex + 1} selected - click destination`);
      } else {
        this.setStatus(`> select your own piece (${this.currentPlayer.toUpperCase()})`);
      }
    } else {
      const validMoves = this.getValidMoves(this.selectedPoint);

      if (validMoves.includes(pointIndex)) {
        this.movePiece(this.selectedPoint, pointIndex);
        this.clearHighlights();
        this.selectedPoint = null;

        if (this.movesLeft.length === 0) {
          this.endTurn();
        } else {
          const player = this.currentPlayer.toUpperCase();
          this.setStatus(`> ${player} - moves left: ${this.movesLeft.join(', ')}`);
        }
      } else if (isCurrentPlayerPiece && pointIndex !== this.selectedPoint) {
        this.clearHighlights();
        this.selectedPoint = pointIndex;
        this.highlightValidMoves(pointIndex);
        this.setStatus(`> point ${pointIndex + 1} selected - click destination`);
      } else {
        this.clearHighlights();
        this.selectedPoint = null;
        const player = this.currentPlayer.toUpperCase();
        this.setStatus(`> ${player} - select a piece`);
      }
    }
  }

  getValidMoves(fromPoint) {
    const validMoves = [];
    const direction = this.currentPlayer === 'white' ? -1 : 1;
    const uniqueMoves = [...new Set(this.movesLeft)];

    for (const move of uniqueMoves) {
      const toPoint = fromPoint + (move * direction);

      if (toPoint < 0 || toPoint > 23) continue;

      const destPieces = this.boardState[toPoint];
      const isBlocked =
        (this.currentPlayer === 'white' && destPieces < -1) ||
        (this.currentPlayer === 'green' && destPieces > 1);

      if (!isBlocked) {
        validMoves.push(toPoint);
      }
    }

    return validMoves;
  }

  movePiece(from, to) {
    const moveDistance = Math.abs(to - from);
    const moveIndex = this.movesLeft.indexOf(moveDistance);
    if (moveIndex > -1) {
      this.movesLeft.splice(moveIndex, 1);
    }

    const pieceValue = this.currentPlayer === 'white' ? 1 : -1;
    this.boardState[from] -= pieceValue;

    // Check for hit
    const destPieces = this.boardState[to];
    if ((this.currentPlayer === 'white' && destPieces === -1) ||
        (this.currentPlayer === 'green' && destPieces === 1)) {
      if (this.currentPlayer === 'white') {
        this.barGreen++;
      } else {
        this.barWhite++;
      }
      this.boardState[to] = 0;
      this.setStatus(`> HIT! opponent sent to bar`);
    }

    this.boardState[to] += pieceValue;
    this.render();
  }

  highlightValidMoves(fromPoint) {
    const validMoves = this.getValidMoves(fromPoint);
    const points = this.board.querySelectorAll('.backgammon-point');

    points.forEach(point => {
      const pointNum = parseInt(point.dataset.point) - 1;
      if (pointNum === fromPoint) {
        point.classList.add('selected');
      } else if (validMoves.includes(pointNum)) {
        point.classList.add('valid-move');
      }
    });
  }

  clearHighlights() {
    const points = this.board.querySelectorAll('.backgammon-point');
    points.forEach(point => {
      point.classList.remove('selected', 'valid-move');
    });
  }

  endTurn() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'green' : 'white';
    this.hasRolled = false;
    this.movesLeft = [];
    const player = this.currentPlayer.toUpperCase();
    this.setStatus(`> ${player}'s turn - click dice to roll`);
  }

  setStatus(message) {
    if (this.statusEl) {
      this.statusEl.textContent = message;
    }
  }

  render() {
    this.renderBoard();
    this.renderBar();
    this.renderHomes();
  }

  renderBoard() {
    const points = this.board.querySelectorAll('.backgammon-point');

    points.forEach(point => {
      const pointNum = parseInt(point.dataset.point);
      if (!pointNum) return;

      const index = pointNum - 1;
      const pieces = this.boardState[index];

      // Remove existing pieces
      const existingPieces = point.querySelectorAll('.backgammon-piece');
      existingPieces.forEach(p => p.remove());

      if (pieces === 0) return;

      const isWhite = pieces > 0;
      const count = Math.abs(pieces);
      const maxShow = 5;
      const isTopHalf = point.closest('.backgammon-half--top');

      for (let i = 0; i < Math.min(count, maxShow); i++) {
        const piece = document.createElement('div');
        piece.className = `backgammon-piece backgammon-piece--${isWhite ? 'white' : 'green'}`;

        if (i === Math.min(count, maxShow) - 1 && count > maxShow) {
          const countBadge = document.createElement('span');
          countBadge.className = 'backgammon-piece--count';
          countBadge.textContent = count;
          piece.appendChild(countBadge);
        }

        point.appendChild(piece);
      }
    });
  }

  renderBar() {
    const barWhiteEl = this.container.querySelector('#barWhite');
    const barGreenEl = this.container.querySelector('#barGreen');

    if (barWhiteEl) {
      const existingPieces = barWhiteEl.querySelectorAll('.backgammon-piece');
      existingPieces.forEach(p => p.remove());

      for (let i = 0; i < this.barWhite; i++) {
        const piece = document.createElement('div');
        piece.className = 'backgammon-piece backgammon-piece--white';
        piece.style.width = '24px';
        piece.style.height = '24px';
        barWhiteEl.appendChild(piece);
      }
    }

    if (barGreenEl) {
      const existingPieces = barGreenEl.querySelectorAll('.backgammon-piece');
      existingPieces.forEach(p => p.remove());

      for (let i = 0; i < this.barGreen; i++) {
        const piece = document.createElement('div');
        piece.className = 'backgammon-piece backgammon-piece--green';
        piece.style.width = '24px';
        piece.style.height = '24px';
        barGreenEl.appendChild(piece);
      }
    }
  }

  renderHomes() {
    const homeWhiteEl = this.container.querySelector('#homeWhite .backgammon-home__pieces');
    const homeGreenEl = this.container.querySelector('#homeGreen .backgammon-home__pieces');

    if (homeWhiteEl) {
      homeWhiteEl.innerHTML = '';
      for (let i = 0; i < this.homeWhite; i++) {
        const piece = document.createElement('div');
        piece.className = 'backgammon-piece backgammon-piece--white';
        piece.style.width = '24px';
        piece.style.height = '24px';
        homeWhiteEl.appendChild(piece);
      }
    }

    if (homeGreenEl) {
      homeGreenEl.innerHTML = '';
      for (let i = 0; i < this.homeGreen; i++) {
        const piece = document.createElement('div');
        piece.className = 'backgammon-piece backgammon-piece--green';
        piece.style.width = '24px';
        piece.style.height = '24px';
        homeGreenEl.appendChild(piece);
      }
    }
  }
}

export default {
  launch(container) {
    return new Backgammon(container);
  }
};
