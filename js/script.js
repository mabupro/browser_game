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

// ステージを増やす関数
function incrementStage() {
    // レベルアップフラグがtrueならステージを増やす
    if (shouldLevelUp) {  
        stage++;
        document.getElementById('stage').textContent = stage;
        shouldLevelUp = false;  
    }
}

// 「Next」ボタンがクリックされたときの処理
document.getElementById('next-button').addEventListener('click', function () {
    incrementStage(); // ステージ増加処理
    startGame(); // ゲームスタート処理
    document.getElementById('next-button').disabled = true; // 「Next」ボタンを無効化
});

// ゲームスタート時のメッセージ非表示
document.getElementById('start-message').style.display = 'none';

function incrementScore() {
    score++;
    document.getElementById('score').textContent = score;
}

function resetScore() {
    score = 0;
    document.getElementById('score').textContent = score;
}

// タイルを生成
for (let i = 0; i < totalTiles; i++) {
    let tile = document.createElement('div');
    tile.className = 'tile';
    tile.onclick = () => verifyTile(i);
    gameBoard.appendChild(tile);
}

// ゲームをスタートする関数
function startGame() {
    clearInterval(timerId);

    document.getElementById('next-button').disabled = true;

    // 白いタイルのクラスをすべて削除
    document.querySelectorAll('.tile.white').forEach(tile => {
        tile.classList.remove('white');
    });

    canClick = false;

    let numberOfWhiteTiles = Math.min(3 + Math.floor(stage / 3), 5);  

    // ステージが上がるごとにタイマーを減らす
    displayTime = Math.max(5 - Math.floor(stage / 3), 3);
    selectionTime = Math.max(15 - Math.floor(stage / 3) * 2, 5);

    resetScore();
    whiteTiles = [];

    // 白いタイルのインデックスをランダムに生成
    while (whiteTiles.length < numberOfWhiteTiles) {  
        let randomIndex = Math.floor(Math.random() * totalTiles);
        if (!whiteTiles.includes(randomIndex)) {
            whiteTiles.push(randomIndex);
        }
    }

    // 白いタイルを一定時間表示
    whiteTiles.forEach(index => {
        gameBoard.children[index].classList.add('white');
    });

    // [displayTime]秒後に白いタイルを非表示にし、スコアをリセット
    setTimeout(() => {
        document.querySelectorAll('.tile.white').forEach(tile => {
            tile.classList.remove('white');
        });
        resetScore();

        // タイマーをスタート
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

function playClickSound() {
    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0; 
    clickSound.play();
}

// タイルが正しいか検証する関数
function verifyTile(index) {
    // クリック可能かチェック
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

            // 3回連続で正解した場合、レベルアップフラグをセット
            if (consecutiveCorrect >= 3) {
                shouldLevelUp = true;
                consecutiveCorrect = 0;
            }
        }
    } else {
        consecutiveCorrect = 0;
    }
}

// ページロード時にメッセージを表示
document.getElementById('start-message').style.display = 'block';

let keyPressStarted = false;

// キーが押されたらゲームスタート
window.addEventListener('keydown', function (event) {
    if (!keyPressStarted) {
        startGame();
        document.getElementById('start-message').style.display = 'none';
        keyPressStarted = true;  
    }
});
