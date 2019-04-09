const BLACK = 1;
const WHITE = 2;
const EMPTY = 0;


var initBoard = (function () {
    return {
        createBoard: function (boardSize) {
            var table = '';
            for (var r = 0; r < boardSize; r++) {
                table += '<tr>';
                for (var c = 0; c < boardSize; c++) {
                    var id_square = r * boardSize + c;
                    if (id_square < 10) {
                        id_square = "0" + id_square;
                    }
                    table += '<td class="square" id="' + id_square + '" >\n' +
                        '<span class="piece"></span> </td>';
                }
                table += '</tr>';
            }
            table = '<tbody>' + table + '</tbody>';
            table = '<table id="board">' + table + '</table>';
            document.write(table);
        },
        initBoard: function () {
            var table = '';
            table = table + '<table id="namesTable">';
            table = table + '<tbody>\n' +
                '            <tr>\n' +
                '            <td class="namesTableCell">\n' +
                '            <span class="white color">White:</span>\n' +
                '        </td>\n' +
                '        <td class="namesTableCell">\n' +
                '            <span class="white color">0</span>\n' +
                '            </td>\n' +
                '            <td class="namesTableCell">\n' +
                '            <span class="black color">Black:</span>\n' +
                '        </td>\n' +
                '        <td class="namesTableCell">\n' +
                '            <span class="black color">0</span>\n' +
                '            </td>\n' +
                '            </tr>\n' +
                '            </tbody>';
            table = table + '</table>'
            document.write(table);
        },
        createStatisticsBoard:function(){
            var statisticstable = '';
            statisticstable = statisticstable + '<table id="statsTable">';
            statisticstable = statisticstable + '<tbody>\n' +
                '            <tr>\n' +
                '            <td class="statsCell">\n' +
                '            <span class="whiteM">White Moves:</span>\n' +
                '        </td>\n' +
                '        <td class="statsCell">\n' +
                '            <span class="whiteMoves">0</span>\n' +
                '            </td>\n' +
                '            <td class="statsCell">\n' +
                '            <span class="blackM">Black Moves:</span>\n' +
                '        </td>\n' +
                '        <td class="statsCell">\n' +
                '            <span class="blackMoves">0</span>\n' +
                '            </td>\n' +
                '            </tr>\n' +
                '            <tr>\n' +
                '            <td class="statsCell">\n' +
                '            <span class="whiteT">White Timer:</span>\n' +
                '        </td>\n' +
                '        <td class="statsCell">\n' +
                '            <span class="whiteTimer">0</span>\n' +
                '            </td>\n' +
                '            <td class="statsCell">\n' +
                '            <span class="blackT">Black Timer:</span>\n' +
                '        </td>\n' +
                '        <td class="statsCell">\n' +
                '            <span class="blackTimer">0</span>\n' +
                '            </td>\n' +
                '            </tr>\n' +
                '            </tbody>';
            statisticstable = statisticstable + '</table>'
            document.write(statisticstable);
        }

    }
})();

var graphic = (function () {
    var domGameBoardObject = null;
    var domNamesTable = null;
    var newGameButton = null;

    return {
        setDomMembers: function () {
            domGameBoardObject = document.getElementById("board");
            domNamesTable = document.getElementById("namesTable");
            newGameButton = document.getElementById("newGameButton");
        },
        setPieceClassNameInDOM: function (row, col, className) {
            domGameBoardObject.rows[row].cells[col].children[0].className = className;
        },
        addClickListenerToPieceInDOM: function (row, col) {
            domGameBoardObject.rows[row].cells[col].addEventListener(
                "click",
                move
            );
        },
        removeClickListenerFromPieceInDOM: function (
            row,
            col,
        ) {
            domGameBoardObject.rows[row].cells[col].removeEventListener(
                "click",
                move
            );
        },
        cleanDOMBoard: function () {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    domGameBoardObject.rows[i].cells[j].children[0].className = "empty piece";
                }
            }
        },
        setInitialStateInDOMBoard: function () {
            domGameBoardObject.style.display = "";
            domNamesTable.style.display = "";

            graphic.signCurrentPlayer();
            graphic.resetScoresInDom();
            domGameBoardObject.rows[4].cells[4].children[0].className = "white piece";
            domGameBoardObject.rows[4].cells[5].children[0].className = "black piece";
            domGameBoardObject.rows[5].cells[4].children[0].className = "black piece";
            domGameBoardObject.rows[5].cells[5].children[0].className = "white piece";
            graphic.cleanAllMarkedSquares();
            signAllValidSquaresAround(4, 4);
            signAllValidSquaresAround(4, 5);
            signAllValidSquaresAround(5, 4);
            signAllValidSquaresAround(5, 5);

            domGameBoardObject.rows[4].cells[4].removeEventListener("click", move);
            domGameBoardObject.rows[4].cells[5].removeEventListener("click", move);
            domGameBoardObject.rows[5].cells[4].removeEventListener("click", move);
            domGameBoardObject.rows[5].cells[5].removeEventListener("click", move);
        },
        hideBoardInDOM: function () {
            domGameBoardObject.style.display = "none";
        },
        hideNamesTableInDOM: function () {
            domNamesTable.style.display = "none";
        },
        addPiecesScore: function () {
            domNamesTable.rows[0].cells[1].children[0].innerHTML = logic.getWhiteScore();
            domNamesTable.rows[0].cells[3].children[0].innerHTML = logic.getBlackScore();
        },
        resetScoresInDom: function () {
            domNamesTable.rows[0].cells[1].children[0].innerHTML = "2";
            domNamesTable.rows[0].cells[3].children[0].innerHTML = "2";
        },
        signCurrentPlayer: function () {
            if (logic.getCurrentColor() === WHITE) {
                domNamesTable.rows[0].cells[2].children[0].className = "black color";
                domNamesTable.rows[0].cells[3].children[0].className = "black color";
                domNamesTable.rows[0].cells[0].children[0].className = "white color activePlayer";
                domNamesTable.rows[0].cells[1].children[0].className = "white color activePlayer";

            } else {
                domNamesTable.rows[0].cells[0].children[0].className = "white color";
                domNamesTable.rows[0].cells[1].children[0].className = "white color";
                domNamesTable.rows[0].cells[2].children[0].className = "black color activePlayer";
                domNamesTable.rows[0].cells[3].children[0].className = "black color activePlayer";
            }
        },
        signValidSquare: function (row, col) {
            domGameBoardObject.rows[row].cells[col].className = "valid square";

        },
        cleanInvalidSquare: function (row, col) {
            domGameBoardObject.rows[row].cells[col].className = "square";
        },
        cleanAllMarkedSquares: function () {
            elementArray = document.getElementsByClassName("valid square");
            while (elementArray.length) {
                elementArray[0].className = "square";
            }
        },
        addListenerToNewGameButton: function () {
            newGameButton.addEventListener("click", startGame);
        },
        removeAllClickListener: function () {
            var size = getBoardSize();
            for (var i = 0; i < size; i++) {
                for (var j = 0; j < size; j++) {
                    graphic.removeClickListenerFromPieceInDOM(i, j);
                }
            }
        },
        changeTextOfButton: function () {
            if (logic.isGameOver()) {
                newGameButton.innerHTML = "New Game";
            } else {
                newGameButton.innerHTML = "End Game";
            }
        }
    };
})();

var logic = (function () {
    var board = [];
    var blackNumber = 0;
    var whiteNumber = 0;
    var currentPlayer = false; // white player=false, black player =true
    var currentColor = WHITE;
    var rivalColor = BLACK;
    var gameOver = false;
    window.globalTimer = null;
    window.blackSec = null;
    window.whiteSec = null;
    window.numWhiteTwo = null;
    window.numBlackTwo = null;
    window.whiteMoves = null;
    window.blackMoves = null;

    return {
        getLocation: function (i, j) {
            var location = null;
            if (isValidIndex(i, j)) {
                location = board[i][j];
            }
            return location;
        },
        cleanLogicBoard: function () {
            for (var i = 0; i < 10; i++) {
                board[i] = [];
                for (var j = 0; j < 10; j++) {
                    board[i][j] = EMPTY;
                }
            }
        },
        setInitialStateInLogicBoard: function () {
            activePlayer = false;
            currentColor = WHITE;
            rivalColor = BLACK;
            logic.resetLogicScores();
            board[4][4] = WHITE;
            board[4][5] = BLACK;
            board[5][4] = BLACK;
            board[5][5] = WHITE;
        },
        locatePiece: function (row, col, colorPiece) {
            var className = null;
            if (colorPiece === WHITE) {
                className = "white piece";
            } else if (colorPiece === BLACK) {
                className = "black piece";
            }
            board[row][col] = colorPiece;
            graphic.setPieceClassNameInDOM(row, col, className);
            graphic.removeClickListenerFromPieceInDOM(row, col);
        },
        changePlayer: function () {
            currentPlayer = !currentPlayer;
            if (!currentPlayer) {
                currentColor = WHITE;
                rivalColor = BLACK;
            } else {
                currentColor = BLACK;
                rivalColor = WHITE;
            }
            graphic.signCurrentPlayer();
        },
        getCurrentPlayer: function () {
            return currentPlayer;
        },
        getCurrentColor: function () {
            return currentColor;
        },
        getRivalColor: function () {
            return rivalColor;
        },
        addPiecesToLogicScore: function (numberOfPieces) {
            if (currentColor === WHITE) {
                whiteNumber += numberOfPieces;
                if (numberOfPieces > 1) {
                    blackNumber -= numberOfPieces;
                    blackNumber += 1;
                }
            } else if (currentColor === BLACK) {
                blackNumber += numberOfPieces;
                if (numberOfPieces > 1) {
                    whiteNumber -= numberOfPieces;
                    whiteNumber += 1;
                }
            }
        },
        resetLogicScores: function () {
            whiteNumber = 2;
            blackNumber = 2;
        },
        getBlackScore: function () {
            return blackNumber;
        },
        getWhiteScore: function () {
            return whiteNumber;
        },
        whoWin: function () {
            var winner = "WHITE";
            if (blackNumber > whiteNumber) {
                winner = "BLACK";
            }
            return winner;
        },
        switchStatistics: function () {
            if (2 === this.getCurrentColor()) {
                whiteMoves += 1;
                whiteSec += this.createCountDown(lastDate, true, whiteSec)
            } else {
                blackMoves += 1;
                blackSec += this.createCountDown(lastDate, true, blackSec)
            }
            lastDate = Date.now()
        },
        updateGameOver: function () {
            gameOver = blackNumber + whiteNumber === boardSize * boardSize || blackNumber === 0 || whiteNumber === 0;
        },
        createCountDown: function (timer, pauseTimer, seconds) {
            if (timer === 0) {
                var startTime = Date.now();
            }
            if (pauseTimer) {
                return (Date.now() - timer) / 1000 + seconds;
            } else {
                return startTime;
            }

        },
        isGameOver: function () {
            return gameOver;
        },
        startStatistics: function () {
            lastDate = this.createCountDown(0, false);
            blackSec = 0;
            whiteSec = 0;
            numWhiteTwo = 0;
            numBlackTwo = 0;
        }

    }
        ;
})();

function getBoardSize() {
    return 10;
}

var boardSize = getBoardSize();
newGame(boardSize);
startGame();

function addAllListeners() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            graphic.addClickListenerToPieceInDOM(i, j);
        }
    }
}

/*
function move() {
    var row = this.id[0],
        col = this.id[1];
    move(Number(row), Number(col), logic.getCurrentColor());
}*/

function newGame(boardSize) {
    initBoard.createBoard(boardSize);
    initBoard.initBoard();
    initBoard.createStatisticsBoard();
    graphic.setDomMembers();
    graphic.addListenerToNewGameButton();
}

function startGame() {
    setInitialState();
}

function setInitialState() {
    logic.cleanLogicBoard();
    logic.setInitialStateInLogicBoard();
    graphic.cleanDOMBoard();
    addAllListeners();
    graphic.setInitialStateInDOMBoard();
    logic.startStatistics()
}

function move(row, col) {
    var row = Number(this.id[0]);
    var col = Number(this.id[1]);
    var numberOfPieces = 0;
    document.getElementById("winner").style.display = "";

    if (isValidMove(row, col)) {
        graphic.cleanInvalidSquare(row, col);
        signAllValidSquaresAround(row, col);
        logic.locatePiece(row, col, logic.getCurrentColor());
        numberOfPieces += eatRivalPieces(row, col);
        logic.addPiecesToLogicScore(numberOfPieces + 1);
        graphic.addPiecesScore();
        logic.switchStatistics();
        logic.changePlayer();
        logic.updateGameOver();

        if (logic.isGameOver()) {
            graphic.changeTextOfButton();
            hideBoard();
            document.getElementById("winner").style.display = "";
            document.getElementById("winner").innerHTML = "The winner is: " + logic.whoWin();
        }
    }
}

function isValidMove(row, col) {
    return isEmpty(row, col) && isPieceAround(row, col);
}

function isPieceAround(row, col) {
    return (
        checkIndex(row - 1, col - 1) ||
        checkIndex(row - 1, col) ||
        checkIndex(row - 1, col + 1) ||
        checkIndex(row, col + 1) ||
        checkIndex(row + 1, col + 1) ||
        checkIndex(row + 1, col) ||
        checkIndex(row + 1, col - 1) ||
        checkIndex(row, col - 1)
    );
}

function signAllValidSquaresAround(row, col) {
    signSquareOrCleanSquare(row - 1, col - 1);
    signSquareOrCleanSquare(row - 1, col);
    signSquareOrCleanSquare(row - 1, col + 1);
    signSquareOrCleanSquare(row, col + 1);
    signSquareOrCleanSquare(row + 1, col + 1);
    signSquareOrCleanSquare(row + 1, col);
    signSquareOrCleanSquare(row + 1, col - 1);
    signSquareOrCleanSquare(row, col - 1);
}

function signSquareOrCleanSquare(row, col) {
    if (checkIndex(row, col) && isValidIndex(row, col)) {
        graphic.cleanInvalidSquare(row, col);
    } else if (isValidIndex(row, col)) {
        graphic.signValidSquare(row, col);
    }
}

function isValidIndex(row, col) {
    return 0 <= row && row < boardSize && 0 <= col && col < boardSize;
}

function checkIndex(row, col) {
    return isValidIndex(row, col) && !isEmpty(row, col);
}

function isEmpty(row, col) {
    return logic.getLocation(row, col) === EMPTY;
}

function getTypePiece(row, col) {
    return logic.getLocation(row, col);
}

function hideBoard() {
    logic.cleanLogicBoard();
    graphic.removeAllClickListener();
    graphic.cleanDOMBoard();
    graphic.hideBoardInDOM();
    graphic.hideNamesTableInDOM();
}

function eatRivalPieces(row, col) {
    var numberOfPieces = 0;

    numberOfPieces += findRivalPiecesAndReplace(row, col, 1, 0);
    numberOfPieces += findRivalPiecesAndReplace(row, col, -1, 0);
    numberOfPieces += findRivalPiecesAndReplace(row, col, 0, 1);
    numberOfPieces += findRivalPiecesAndReplace(row, col, 0, -1);
    numberOfPieces += findRivalPiecesAndReplace(row, col, -1, -1);
    numberOfPieces += findRivalPiecesAndReplace(row, col, 1, 1);
    numberOfPieces += findRivalPiecesAndReplace(row, col, -1, 1);
    numberOfPieces += findRivalPiecesAndReplace(row, col, 1, -1);

    return numberOfPieces;
}

// This function gets index with row and column and direction for the search, and
// inserts all the pieces that we need to replace, to "replaceablePiecesStack".
// after that, the function replaces all of the pieces that in the stack.
function findRivalPiecesAndReplace(row, col, rowDir, colDir) {
    var numberOfPieces = 0;
    var targetRow = row + rowDir;
    var targetCol = col + colDir;
    var temp = new Array();
    var index;
    while (getTypePiece(targetRow, targetCol) === logic.getRivalColor()) {
        temp.push({
            targetRow,
            targetCol
        })
        targetRow += rowDir;
        targetCol += colDir;
    }

    if (getTypePiece(targetRow, targetCol) === logic.getCurrentColor()) {
        while (temp.length !== 0) {
            numberOfPieces++;
            index = temp.pop();
            logic.locatePiece(index.targetRow, index.targetCol, logic.getCurrentColor());
        }
    }
    return numberOfPieces;

}
