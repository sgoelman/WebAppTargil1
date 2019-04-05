const BLACK = 1;
const WHITE = 2;
const EMPTY = 0;
const HEIGHT = 10;
const WIDTH = 10;

var graphic = (function () {
    var domGameBoardObject = document.getElementById("board");
    var domNamesTable = document.getElementById("namesTable");

    document.addEventListener("DOMContentLoaded", function () {
        this.getElementById("newGameButton").addEventListener("click", newGame);
    }, false);

    return {
        setPieceClassNameInDOM: function (row, col, className) {
            domGameBoardObject.rows[row].cells[col].children[0].className = className;
        },
        addClickListenerToPieceInDOM: function (row, col, eventName, functionName) {
            domGameBoardObject.rows[row].cells[col].addEventListener(
                "click",
                addClickListener
            );
        },
        removeClickListenerFromPieceInDOM: function (
            row,
            col,
            eventName,
            functionName
        ) {
            domGameBoardObject.rows[row].cells[col].removeEventListener(
                "click",
                addClickListener
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

            domGameBoardObject.rows[4].cells[4].removeEventListener("click", addClickListener);
            domGameBoardObject.rows[4].cells[5].removeEventListener("click", addClickListener);
            domGameBoardObject.rows[5].cells[4].removeEventListener("click", addClickListener);
            domGameBoardObject.rows[5].cells[5].removeEventListener("click", addClickListener);
        },
        hideBoardInDOM: function () {
            domGameBoardObject.style.display = "none";
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
        createBoard: function (boardSize) {
            var table = '';
            for (var r = 0; r < boardSize; r++) {
                table += '<tr>';
                for (var c = 0; c < boardSize; c++) {
                    var id_square = r * boardSize + c;
                    table += '<td class="square" id="' + id_square + '" >\n' +
                        '<span class="piece"></span> </td>';
                }
                table += '</tr>';
            }
            table = '<tbody>' + table + '</tbody>';
            table = '<table class="table" id="board">' + table + '</table>';
            document.write(table);
        },
        initBoard: function () {
            var table = '<button id="newGameButton">New Game</button>';
            table = table + '<table class="table" id="namesTable">';
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
        }

    };
})();

newGame();
//cleanBoard();
//newGame();
//hideBoard();;
function newGame() {
    graphic.createBoard(10);
    graphic.initBoard();
    setInitialState();
}

function addAllListeners() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            graphic.addClickListenerToPieceInDOM(i, j);
        }
    }
}

function addClickListener() {
    var row = this.id[0],
        col = this.id[1];
    move(Number(row), Number(col), logic.getCurrentColor());
}


function setInitialState() {
    logic.cleanLogicBoard();
    logic.setInitialStateInLogicBoard();
    graphic.cleanDOMBoard();
    addAllListeners();
    graphic.setInitialStateInDOMBoard();
}

function move(row, col) {
    var numberOfPieces = 0;
    if (isValidMove(row, col)) {
        graphic.cleanInvalidSquare(row, col);
        signAllValidSquaresAround(row, col);
        logic.locatePiece(row, col, logic.getCurrentColor());
        numberOfPieces += eatRivalPieces(row, col);
        logic.addPiecesToLogicScore(numberOfPieces + 1);
        graphic.addPiecesScore();
        logic.changePlayer();
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
    return 0 <= row && row < HEIGHT && 0 <= col && col < WIDTH;
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
    graphic.cleanDOMBoard();
    graphic.hideBoardInDOM();
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


