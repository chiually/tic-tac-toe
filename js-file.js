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
const GameController = (function(playerOneName = "player1", playerTwoName = "player2") {

    const player1 = createPlayer(playerOneName, "O");
    const player2 = createPlayer(playerTwoName, "X");

    let activePlayer = player1;
    let counter = 0;

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => activePlayer = (activePlayer === player1) ? player2 : player1;

    const printNewRound = () => {
        console.log(activePlayer.name + "'s turn!")
        GameBoard.printBoard();
    };

    const playRound = function(location) {
        // if move was legal 
        if (GameBoard.writeMoveToBoard(activePlayer, location)) {

            if (checkForWin(location)) {
                console.log(`${activePlayer.name} is the winner!`)
                GameBoard.printBoard();
                GameBoard.clearBoard();
                counter = 0;
                return;
            }

            switchActivePlayer()
            counter++;
        }

        if (counter === 9) {
            console.log("No winner");
        }
        else {
            printNewRound();
        }
    };

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
        getActivePlayer
    }

})("allyssa");

const game = GameController;
