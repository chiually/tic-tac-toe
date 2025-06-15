function createPlayer(name, letter) {
    return {name, letter};
}

// IIFE
// representation of tic tac toe board
// GameBoard is the object itself
const GameBoard = (function() {
    let board = Array.from({ length: 3 }, () => Array(3).fill("_")); // each array is a row in tic tac toe board

    const getBoard = () => board;

    const writeMoveToBoard = (player, location) => {
        const col = location[0]; // location is [x, y]
        const row = location[1];

        if (board[row][col] !== "_") {
            console.log("you cannot move here");
            return false;
        }
        else {
            board[row][col] = player.letter;
        }

        return true;
    }

    const printBoard = function() {
        let output = board.map(row => row.join(" ")).join("\n");
        console.log(output)
    };

    const clearBoard = () => board = Array.from({ length: 3 }, () => Array(3).fill("_"));

    return {
        getBoard,
        clearBoard,
        printBoard,
        writeMoveToBoard
    };
})();

// X represented by 1, O represented by 0
// contains game logic and flow 
function GameController(playerOneName = "player1", playerTwoName = "player2") {

    const player1 = createPlayer(playerOneName, "O");
    const player2 = createPlayer(playerTwoName, "X");
    let msg = "";

    let activePlayer = player1;
    let counter = 0;

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => activePlayer = (activePlayer === player1) ? player2 : player1;

    const printNewRound = () => {
        msg = activePlayer.name + "'s turn!";
        console.log(msg);
        GameBoard.printBoard();
        return msg;
    };

    const getMsg = () => msg;

    const playRound = function(location) {
        // if move was legal 
        if (GameBoard.writeMoveToBoard(activePlayer, location)) {

            if (checkForWin(location)) {
                msg = `${activePlayer.name} is the winner!`;
                console.log(msg)
                GameBoard.printBoard();
                return;
            }

            switchActivePlayer()
            counter++;
        }

        if (counter === 9) {
            msg = "No winner";
            console.log(msg);
        }
        else {
            printNewRound();
        }
    };

    const restart = function() {
        GameBoard.clearBoard();
        counter = 0;
        activePlayer = player1;
        msg = activePlayer.name + "'s turn!";
    }

    const checkHorizontal = function(board, row, letter) {
        for (let i = 0; i < 3; i++) {
            if (board[row][i] !== letter) {
                return false;
            }
        }
        return true;
    };

    const checkVertical = function(board, col, letter) {
        for (let i = 0; i < 3; i++) {
            if (board[i][col] !== letter) {
                return false;
            }
        }
        return true;
    };

    const checkDiagonals = function(board, letter) {
        let diagonal1 = true;
        let diagonal2 = true;

        for (let i = 0; i < 3; i++) {
            if (board[i][i] !== letter) {
                diagonal1 = false;
            }
        }

        for (let i = 2; i >= 0; i--) {
            if (board[i][2 - i] !== letter) {
                diagonal2 = false;
            }
        }

        return diagonal1 || diagonal2;
    }

    const checkForWin = function(location) {

        const col = location[0]; // location is [x, y]
        const row = location[1];
        const letter = activePlayer.letter;
        const board = GameBoard.getBoard();

        // console.log(checkDiagonals(board, letter))
        // console.log(checkHorizontal(board, row, letter))
        // console.log(checkVertical(board, col, letter))

        return checkDiagonals(board, letter) || checkHorizontal(board, row, letter) || checkVertical(board, col, letter);
    };

    // inital starting game message
    printNewRound();

    return {
        playRound,
        getMsg,
        restart,
        getActivePlayer,
        getBoard: GameBoard.getBoard
    }

}

const ScreenController = (function(){
    let game;

    const containerDiv = document.querySelector(".container");
    const boardDiv = document.querySelector("#board");
    const startButton = document.getElementById("start-button");
    const nameDialog = document.querySelector("dialog");
    const msgDiv = document.createElement("div");
    const okButton = document.getElementById("ok-button");

    const showDialog = function() {
        nameDialog.showModal();
    };

    const updateScreen = function() {

        const board = game.getBoard();
        const msg = game.getMsg()
        msgDiv.textContent = msg;

        // for each row
        for (let x = 0; x < 3; x++) {
            // for each col
            for (let y = 0; y < 3; y++) {
                const btn = document.querySelector(`button[data-row="${x}"][data-col="${y}"]`);
                // console.log(`button[data-row="${x}"][data-col="${y}"]`);

                if (board[x][y] !== "_") {
                    btn.textContent = board[x][y]
                }
                else {
                    btn.textContent= ""; 
                }
            }
        }

        if (msg != null && msg.toLowerCase().includes("winner")) {
            // don't allow further moves
            boardDiv.style.pointerEvents = "none";
        }
    }

    const restartGame = function() {
        boardDiv.style.pointerEvents = "auto";
        game.restart();
        updateScreen();
    }

    const clickHandlerBoard = function(event) {
        const selectedRow = event.target.dataset.row;
        const selectedCol = event.target.dataset.col;

        if (!selectedRow || !selectedCol) return;

        game.playRound([selectedCol, selectedRow]); // since board is nested array with each row as a list
        updateScreen();
    }

   const handleSubmit = function() {
        const form = nameDialog.querySelector("form");

        const formData = new FormData(form);
        const player1 = formData.get("player1-name");
        const player2 = formData.get("player2-name");

        game = GameController(player1, player2);

        form.reset();
    }

    startButton.addEventListener("click", showDialog);

    nameDialog.addEventListener("close", () => {
        startButton.textContent = "Restart Game";
        startButton.removeEventListener("click", showDialog);

        handleSubmit();

        // add msg board
        msgDiv.className = "msg-board";
        msgDiv.textContent = game.getMsg();
        containerDiv.appendChild(msgDiv);

        startButton.addEventListener("click", restartGame);
    });

    boardDiv.addEventListener("click", clickHandlerBoard);

})();

