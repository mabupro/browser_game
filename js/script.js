// 1. 初期設定: ゲームに必要な変数やDOM要素を設定します。
const gameBoard = document.getElementById('game-board');
const totalTiles = 10;
let whiteTiles = [];
let score = 0;
let stage = 1;
let shouldLevelUp = false;
let consecutiveCorrect = 0;
let timerId;
let displayTime = 5;
let selectionTime = 15;
let canClick = false;

// 2. ゲームセットアップ: タイルを生成し、ユーザーの入力（キー入力やボタンクリック）に応じてゲームを開始します。
// 2.1. タイル生成とクリックイベントのセットアップ
for (let i = 0; i < totalTiles; i++) {
    let tile = document.createElement('div');
    tile.className = 'tile';
    tile.onclick = () => verifyTile(i);
    gameBoard.appendChild(tile);
}

// 2.2. キー入力またはボタンクリックでゲームスタート
document.getElementById('next-button').addEventListener('click', startGameSequence);
window.addEventListener('keydown', startGameOnKeyPress);

// 3. ゲームスタート: 白いタイルを表示し、ユーザーに選択を促します。
function startGame() {
    clearInterval(timerId);
    document.getElementById('next-button').disabled = true;
    document.querySelectorAll('.tile.white').forEach(tile => tile.classList.remove('white'));
    canClick = false;

    let numberOfWhiteTiles = Math.min(3 + Math.floor(stage / 3), 5);
    displayTime = Math.max(5 - Math.floor(stage / 3), 3);
    selectionTime = Math.max(15 - Math.floor(stage / 3) * 2, 5);

    resetScore();
    whiteTiles = [];

    while (whiteTiles.length < numberOfWhiteTiles) {
        let randomIndex = Math.floor(Math.random() * totalTiles);
        if (!whiteTiles.includes(randomIndex)) {
            whiteTiles.push(randomIndex);
        }
    }

    whiteTiles.forEach(index => gameBoard.children[index].classList.add('white'));

    setTimeout(() => {
        document.querySelectorAll('.tile.white').forEach(tile => tile.classList.remove('white'));
        resetScore();

        let selectionCounter = selectionTime;
        document.getElementById('timer').textContent = selectionCounter;
        timerId = setInterval(() => {
            selectionCounter--;
            document.getElementById('timer').textContent = selectionCounter;
            if (selectionCounter <= 0) {
                clearInterval(timerId);
                alert("Game Over");
                location.reload();
            }
        }, 1000);

        canClick = true;
    }, displayTime * 1000);
}

// 4. タイル選択: ユーザーがタイルをクリックし、それが正しいかどうかを検証します。
function verifyTile(index) {
    if (!canClick) {
        return;
    }

    playClickSound();

    if (whiteTiles.includes(index)) {
        incrementScore();
        consecutiveCorrect++;
        gameBoard.children[index].classList.add('white');
        whiteTiles = whiteTiles.filter(i => i !== index);

        if (whiteTiles.length === 0) {
            clearInterval(timerId);
            document.getElementById('next-button').disabled = false;

            if (consecutiveCorrect >= 3) {
                shouldLevelUp = true;
                consecutiveCorrect = 0;
            }
        }
    } else {
        consecutiveCorrect = 0;
    }
}

// 補助関数群
function incrementStage() {
    if (shouldLevelUp) {
        stage++;
        document.getElementById('stage').textContent = stage;
        shouldLevelUp = false;
    }
}

function incrementScore() {
    score++;
    document.getElementById('score').textContent = score;
}

function resetScore() {
    score = 0;
    document.getElementById('score').textContent = score;
}

function playClickSound() {
    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0;
    clickSound.play();
}

// ゲームスタートのシーケンス
function startGameSequence() {
    incrementStage();
    startGame();
    document.getElementById('next-button').disabled = true;
}

// キー押下時のゲームスタート
function startGameOnKeyPress(event) {
    if (!keyPressStarted) {
        startGame();
        document.getElementById('start-message').style.display = 'none';
        keyPressStarted = true;
    }
}

// ページロード時のメッセージ表示
document.getElementById('start-message').style.display = 'block';
let keyPressStarted = false;
